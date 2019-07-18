# AMIS
A Mouse Image Server


1. http://amis.docking.org/loadimages
This script will load all tif files from ‘/nfs/ex9/idg-images/’  including all sub folders. If .tif file is already in our database it sill skip those files. If .tif file is new and not stored our database, it will store data by parsing file name. If there is no jpg file with same file name in the same directory, script will lookup jpg file from ‘/nfs/ex9/idg-images/jpegs/’ folder and it will move the jpeg files from this directory if there is jpeg file with same name.  

2. http://amis.docking.org/TAS2R4/thymus
It will automatically select gene and organ that specified in the URL http://amis.docking.org/{gene}/{organ}


Returns all data without any pagination
http://amis.docking.org/slices?per_page=-1

http://amis.docking.org/TAS2R4/thymusReturns all data without any pagination and filter by gene
http://amis.docking.org/slices?per_page=-1&gene=GPR85


There are 2 types of format that script loads.

 #| Uploaded 4/22/2019 | | Uploaded 4/17/2019 |  |
--- | --- | --- | --- |--- |
 #| nomenclature | Value | nomenclature | Value | 
1 | gene | GPR85 | gene | GPR85 | 
2 | experiment | Ai9 | experiment | Ai9 |
3 | genotype_gene | 1 | genotype_gene | 1 |
4 | genotype_reporter | 1 | genotype_reporter | 0 |
5 | mouse_number | 1 | mouse_number | 1538b |
6 | sex | M | sex | F |
7 | age | p30 | age | p30 |
8 | manipulation_type | reporter-gene-cross | manipulation_type | reporter-gene-cross |
9 | organ | brain | organ | jeja | 
10 | UBERON | 955 | UBERON | 2115 |
11 | slice_number | 0000 | orientation | nd |
12 | z_step_size | 5.97867 | slice_number | 1 |
13 | resolution | 20x | slide_id | 2 |
14 | instrument | LSM | objective | 4x |
15 | wavelength | tdTomato | instrument | Keyence |
16 | checksum | md5 | wavelength | tdTomato |
17 |  | | checksum | checksum |


If you want to download as a json format. You need to add .json after slices as below.
http://amis.docking.org/slices.json?per_page=-1

