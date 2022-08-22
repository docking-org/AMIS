# AMIS
A Mouse Image Server


1. http://amis.docking.org/loadimages
This script will load all tif files from ‘/nfs/ex9/idg-images/’  including all sub folders. If .tif file is already in our database it sill skip those files. If .tif file is new and not stored our database, it will store data by parsing file name. If there is no jpg file with same file name in the same directory, script will lookup jpg file from ‘/nfs/ex9/idg-images/jpegs/’ folder and it will move the jpeg files from this directory if there is jpeg file with same name.  

2. http://amis.docking.org/TAS2R4/thymus or http://amis.docking.org?gene=TAS2R4&organ=thymus 
It will automatically select gene and organ that specified in the URL http://amis.docking.org/{gene}/{organ}


Returns all data without any pagination
http://amis.docking.org/slices?per_page=-1

Returns all data without any pagination and filter by gene
http://amis.docking.org/slices?per_page=-1&gene=GPR85


There are 2 types of format that script loads.

 #| Histological | | Cleared |  |
--- | --- | --- | --- |--- |
 #| nomenclature | Value | nomenclature | Value | 
1 | gene | GPR85 | gene | GPR85 | 
2 | experiment | Ai9 | experiment | Ai9 |
3 | genotype_gene | 1 | genotype_gene | 1 |
4 | genotype_reporter | 1 | genotype_reporter | 1 |
5 | mouse_number | 1540 | mouse_number | 1 |
6 | sex | m | sex | M |
7 | age | p30 | age | p30 |
8 | manipulation_type | reporter-gene-cross | manipulation_type | reporter-gene-cross |
9 | organ | heart | organ | brain | 
10 | UBERON | 948 | UBERON | 955 |
11 | orientation | nd | orientation | c |
12 | slde_number | 00001 | slice_id | 812 |
13 | slice_id | 3 | z_step_size | 1 .26675|
14 | objective | 10x | objective | 20x |
15 | instrument | Olympus | instrument | LSM |
16 | wavelength | DAPI | wavelength | tdTomato |
17 | checksum | md5 | checksum | md5 |



If you want to download as a json format. You need to add .json after slices as below.
http://amis.docking.org/slices.json?per_page=-1

