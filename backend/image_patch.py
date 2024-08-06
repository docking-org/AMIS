from PIL import Image
import glob
import os
import cv2
import numpy as np
import multiprocessing
from multiprocessing import Pool
from split_images import split
import os
import gdal2tiles
from pathlib import Path


def convert_png_to_white_pixel(name):
    """ a function that converts a binary png file to a white pixel image. 
    the image is a binary png where 2 is white and 1 is black.
    load the image and convert it to RGB. Then, convert the 2 to white and 1 to transparent.
    """

    filename = name.split(".png")
    filename = filename[0]

    im = Image.open(name)
    im = im.convert(mode='RGB')
    datas = im.getdata()

    newData = []

    for item in datas:
        if item[0] == 2:
            newData.append((0, 0, 0, 0))
        else:
            newData.append((255, 255, 255, 1))

    im.putdata(newData)
    im.save(filename+".png", "png")
    

       
def process(file):
    # """calls the appropriate function to convert the file to rgb. if the file is a png file, convert it to white pixel image. then, split the image."""
    # if ".png" in file:
    #     convert_png_to_white_pixel(file)
   
    split(file)
    


def split(file, tile_size=256, overlap=0, format='PNG', quality=100):
    # split into tiles, 16 bit tif files are kept as 16 bit
    options = {
        'zoom': (0, 7),
        'tile_size': tile_size,
        'overlap': overlap,
        'format': format,
        'quality': quality,
        'resampling': 'average',
        's_srs': 'EPSG:3857',
        'profile': 'mercator',
        'processes': 4,
        'resume': True,
        }

    # PATH is the path to the folder where the images are located, locate the root folder of the file variable
    path =  Path(file.replace('\n', '')).parent
    
    file_name = Path(file.replace('\n', '')).stem
    

    output_folder = '{}/{}'.format(path, file_name)    
        
    try:
        if not os.path.isdir(output_folder):
            os.mkdir(output_folder)
            print(output_folder, " dir is created")
            gdal2tiles.generate_tiles(
                file, output_folder, **options)
    except Exception as e:
        print("Error: ", e)



if __name__ == "__main__":
    """a full function to use the convert to rgb function to convert all tif files in the directory  to rgb. 
    if the file extension is not tif, do not convert it to rgb. if the file extension is png, convert it to white pixel image.

    first, get all the files in the directory 
    then, filter the files to get only the png and tif files
    then, call the process function to convert the files to rgb and split the images.
    """         
    files = glob.glob("/nfs/ex9/idg-images/320006/**", recursive=True)
    
    files = [file for file in files if ".tif" in file]
    count = len(files)
    for file in files:
        process(file)
        