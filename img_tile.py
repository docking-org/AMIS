import os
import gdal2tiles
from osgeo import gdal
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

path = "./out"


options = {
    'zoom': (0, 7),
    'resampling': 'average',
    'resume': True,
    'profile': 'raster',
    'webviewer': 'none',
    'nb_processes': multiprocessing.cpu_count()
}


#files = [f for f in glob.glob(path + "/**/*.jpg", recursive=True)]
#for file in files:
#    file_name = Path(file).stem
#    file_name_with_ext = Path(file).name
#
#    file_sub_folder = str(Path(file).parent)[len(path):]


for file in os.listdir(path):
    file_name = Path(file.replace('\n', '')).stem
    file_name_with_ext = Path(file.replace('\n', '')).name

    file_sub_folder = str(Path(file.replace('\n', '')).parent)[len(path):]

    if "hidden" in file_sub_folder or "test" in file_sub_folder:
        continue

    destination = "{}{}/".format(path, file_sub_folder)
    dest_file_with_jpg = "{}{}.tif".format(destination, file_name)
    dest_and_file = "{}{}".format(destination, file_name)
    try:
        if not os.path.isdir(dest_and_file):
            os.mkdir(dest_and_file)
            print(dest_and_file, " dir is created")
            gdal2tiles.generate_tiles(
                dest_file_with_jpg, dest_and_file, **options)
    except Exception as e:
        print("Error: ", e)