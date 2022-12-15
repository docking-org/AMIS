import os


import gdal2tiles
from pathlib import Path
import glob
import multiprocessing

# multiprocessing.cpu_count()
# print(path)
# path = os.getcwd()
# path = '{}/input'.format(path)
# options = {'zoom': (0, 7), 'resampling': 'average', 'resume': True,
#            'profile': 'raster'}
# , 'tmscompatible': True

# gdal2tiles.generate_tiles(
#     '{}/input/pic4.jpEg'.format(path), '{}/output/'.format(path), **options)


def split(file, tile_size=256, overlap=0, format='PNG', quality=100):
    options = {
        'zoom': (0, 7),
        'resampling': 'average',
        'resume': True,
        'profile': 'raster',
        'webviewer': 'none',
        'nb_processes': multiprocessing.cpu_count(),
        'tile_size': tile_size,
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

