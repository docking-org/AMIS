SQLALCHEMY_DATABASE_URI = 'postgresql://amis_user:amis1@mem2:5432/amis'

import psycopg2
import os

connection = psycopg2.connect(SQLALCHEMY_DATABASE_URI)
cursor = connection.cursor()

exj_paths = os.listdir('/nfs/exj/idg-images/')
mammoth_paths = os.listdir('/nfs/mammoth/idg-images/')
cursor.execute("SELECT distinct(img_path) FROM slice where img_path like '/nfs/exj/idg-images%'")
slice_paths = cursor.fetchall()
#if there images that say they are in exj, but are not actually there, check if the folder is on mammoth, then change the db to match
print(exj_paths)
for path in slice_paths:
    p = path[0].split('/')[-1]
    print(p)
    
    if p not in exj_paths:
        if p in mammoth_paths:
            # cursor.execute("UPDATE slice SET img_path = '/nfs/mammoth/idg-images/{}' WHERE img_path = '/nfs/exj/idg-images/{}'".format(p,p))
            # connection.commit()
            print('Changed {} to mammoth'.format(p))
        else:
            print('Could not find {}'.format(p))