import os
import numpy as np
import glob
import csv

lookuptables = {}

files = glob.glob('app/data/lut/*.csv')

for file in files:
    with open(file, 'r') as f:
        
        lines = csv.reader(f)
        next(lines)
        lut = np.zeros((256, 1, 3), dtype=np.uint8)
        for row in lines:
            i  = int(row[0])
            
            lut[i, 0, 0] = int(row[3])
            lut[i, 0, 1] = int(row[2])
            lut[i, 0, 2] = int(row[1])
        
        lookuptables[file.split('.')[0].split('/')[-1]] = lut
    
