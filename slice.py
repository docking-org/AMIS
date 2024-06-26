#generate pyramid images at various zoom levels for use in leaflet
# save at z/x/y.png
tile_size = 256
zoom_levels = 6
from tqdm.contrib.concurrent import process_map
import os
os.environ["OPENCV_IO_MAX_IMAGE_PIXELS"] = str(pow(2,40))
import sys
import numpy as np
import cv2
import math
import multiprocessing
from tqdm import tqdm

#preprocess and generate a base layer
def generate_base_layer(image_path, output_path):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    img = cv2.resize(img, (512, 512))
    # max = np.max(img)
    # min = np.min(img)
    # print(f'Max: {max}, Min: {min}')
    # img = cv2.normalize(img, None, min, max, cv2.NORM_MINMAX)
    cv2.imwrite(output_path, img)

#generate pyramid images at various zoom levels
def generate_pyramid(image_path, output_folder):
    img = cv2.imread(image_path, -1)
    # max = np.max(img)
    # min = np.min(img)
    # img = cv2.normalize(img, None, min, max, cv2.NORM_MINMAX)
    # jobs = []
    # manager = multiprocessing.Manager()
    for zoom in tqdm(range(zoom_levels)):
        zoom_factor = 2 ** zoom
        img_zoom = cv2.resize(img, (512 * zoom_factor, 512 * zoom_factor))
        tqdm.write(f'Generating zoom level {zoom} with shape {img_zoom.shape}')
        for x in tqdm(range(0, img_zoom.shape[1], tile_size)):
            for y in range(0, img_zoom.shape[0], tile_size):
                tile = img_zoom[y:y+tile_size, x:x+tile_size]
                if tile.shape[0] == tile_size and tile.shape[1] == tile_size:
                    os.makedirs(os.path.join(output_folder, str(zoom), str(x//tile_size)), exist_ok=True)
                    tile_path = os.path.join(output_folder, f'{zoom}/{x//tile_size}/{y//tile_size}.png')
                    cv2.imwrite(tile_path, tile)
                

def process(image_path): 
    image_path = "/export/mammoth/idg-images/"+image_path
    if os.path.exists(image_path):
        tqdm.write(f'Processing {image_path}')
        img_list = []
        if os.path.isdir(image_path):
            for file in os.listdir(image_path):
                if file.endswith('.tif'):
                    img_list.append(file)
                    
        #generate pyramid for each image, folder is same as image name without extension
        for img in tqdm(img_list):
            output_folder = os.path.join(image_path, img.split('.')[0])
            if os.path.exists(output_folder):
                for i in range(zoom_levels):
                    #move folder to i.old
                    tqdm.write(f'Moving {os.path.join(output_folder, str(i))} to {os.path.join(output_folder, f"{i}.old")}')
                    if not os.path.exists(os.path.join(output_folder, f'{i}.old')):
                        os.rename(os.path.join(output_folder, str(i)), os.path.join(output_folder, f'{i}.old'))
                    
            os.makedirs(output_folder, exist_ok=True)
            try:
                generate_base_layer(os.path.join(image_path, img), os.path.join(output_folder, 'base.png'))
                generate_pyramid(os.path.join(image_path, img), output_folder)
                print(f'Generated pyramid for {img}')
            except:
                pass
    

if __name__ == '__main__':
    #find all tifs in input folder

    image_paths = sys.argv[1]
    print(f'Processing {image_paths}')
    
    # for image_path in tqdm(image_paths.split(',')):    
    map = process_map(process, image_paths.split(','), max_workers=12)
