from PIL import Image
import glob
import os

print(os.getcwd())
files = glob.glob(os.getcwd() + "/out/326004_tongue-1_03_composite/**/*.png", recursive=True)
for name in files:
    if "-" in name.split('/')[-1]:
        print(name)
        filename = name.split(".png")
        filename = filename[0]
        listcheck = glob.glob(filename+".*")
        
        im = Image.open(name)
        
        datas = im.getdata()

        newData = []
        for item in datas:
          
            if item[0] <= 30 and item[1] <= 30 and item[2] <= 30:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
        im.putdata(newData)
        im.save(name, "png")
        # im1 = Image.Image.split(im)
        # name = name[0]
        # im1[0].convert("RGBA").save(filename+"-r.png", format="png")
        # im1[1].convert("RGBA").save(filename+"-g.png", format="png")
        # im1[2].convert("RGBA").save(filename+"-b.png", format="png")
