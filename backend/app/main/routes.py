from flask import render_template, request, send_file, make_response, jsonify
import json
import cv2
import json
import urllib
import numpy as np
from app.data.lut.lookuptables import lookuptables
from app.main import application
from app.helpers.validation import load_images
from app.data.models.slice import SliceModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.organ import OrganModel
from app.data.models.experiment import ExperimentModel
from app.data.models.genotype import GenotypeModel
from app.data.models.mouse import MouseModel
from app.data.models.mani_type import ManipulationTypeModel
from flask import current_app
import os
import shutil
import glob
from pathlib import Path
from PIL import Image

# @application.route('/', methods=['GET'])
# def index(gene_name=None, organ_name=None):
#     gene = request.args.get("gene")
#     organ = request.args.get("organ")
#     genes = GeneNameModel.find_all()
#     organs = OrganModel.find_all()
#     return render_template('index.html', genes=genes, organs=organs, gene_name=gene, organ_name=organ)


@application.route('/slice', methods=['GET'])
def get_slice():
    return render_template('slice.html')


@application.route('/gene', methods=['GET'])
def gene():
    return render_template('gene.html')


@application.route('/organ', methods=['GET'])
def organ():
    return render_template('organ.html')


@application.route('/experiment', methods=['GET'])
def experiment():
    return render_template('experiment.html')


@application.route('/mouse', methods=['GET'])
def mouse():
    return render_template('mouse.html')


@application.route('/interest', methods=['GET'])
def interest():
    genes = GeneModel.find_unique_names()
    organs = OrganModel.find_all()
    return render_template('interest.html', genes=genes, organs=organs)


# @application.route('/upload/<type>', methods=['GET', 'POST'])
# def upload_file(type):
#     if request.method == 'POST':
#         folder = current_app.config['FILE_UPLOAD_FOLDER']
#         file = request.files['file']
#         file_dir = os.path.realpath(os.path.dirname(folder))
#         pathlib.Path(file_dir).mkdir(parents=True, exist_ok=True)
#         file.stream.seek(0)
#         filename = file_dir + "/test.csv"
#         if os.path.exists(filename):
#             os.remove(filename)
#         file.save(os.path.join(filename))
#
#         records = pe.iget_records(file_name=filename)
#         save_excel_records(type, records, pe)
#         pe.free_resources()
#
#         print("print post")
#         return "Successfully uploaded!\n"
#     else:
#         print("print get")
#         return "GET"

@application.route('/loadimages', methods=['GET', 'POST'])
def image_load():
    # folder = current_app.config['IMAGE_LOAD_FOLDER']
    # file_dir = os.path.realpath(os.path.dirname(folder))
    # lst = os.listdir(file_dir)
    # ret = save_file_list(lst)
    
    skipped = 0
    new_files = 0
    jpegs = 0
    moved_jpegs = 0
    p_denied = 0
    missing_jpegs = []
    folder = current_app.config['IMAGE_LOAD_FOLDER']
    path = os.path.realpath(os.path.dirname(folder))
    print("Path: {}".format(path))
    files = [f for f in glob.glob(path + "/**/*.tif", recursive=True)]
    for file in files:
        file_name = Path(file).stem
        file_name_with_ext = Path(file).name
        file_sub_folder = str(Path(file).parent)[len(path):]


        # print("File: {}".format(file))
        # print("File name: {}".format(file_name))
        # print("File name with extention: {}".format(file_name_with_ext))
        # print("File sub folder: {}".format(file_sub_folder))

        if "hidden" in file_sub_folder:
            # print("_______________Skipped the file in HIDDEN dir: {}/{}".
            #       format(file_sub_folder, file_name_with_ext))
            continue

        full_path_without_ext = "{}{}/{}".format(path, file_sub_folder, file_name)
        print("full_path_without_ext", full_path_without_ext)
        # It converts png to resized .webp file if there is now *.webp file
        for type in ["_RI.", "."]:
            if not os.path.isfile('{}{}webp'.format(full_path_without_ext, type)) and \
                    os.path.isfile('{}{}png'.format(full_path_without_ext, type)):
                fixed_height = 350
                image = Image.open("{}{}png".format(full_path_without_ext, type))
                height_percent = (fixed_height / float(image.size[1]))
                width_size = int((float(image.size[0]) * float(height_percent)))

                image = image.resize((width_size, fixed_height), Image.NEAREST)
                image.save('{}{}webp'.format(full_path_without_ext, type), optimize=True, quality=50)

        if SliceModel.isRegistered(file_name):
            destination = "{}{}/".format(path, file_sub_folder)
            dest_file_with_jpeg = "{}{}.jpg".format(destination, file_name)
            # print("DEST:"+destination+file_name)
            # print("dest_file_with_jpeg:" + dest_file_with_jpeg)
            if not os.path.isfile(dest_file_with_jpeg):
                jpegs += 1
                jpeg_folder = current_app.config['JPEG_FOLDER']
                jpeg_path = os.path.realpath(os.path.dirname(jpeg_folder))
                print("jpeg_path:" + jpeg_path)
                source = "{}/{}.jpg".format(jpeg_path, file_name)
                print("SOURCE:" + source)
                try:
                    if os.path.isfile(source):
                        moved_jpegs += 1
                        print("DEST:" + destination)
                        print("SOURCE:" + source)
                        shutil.move(source, destination)
                        print("JPEG file has been moved to " + destination)
                    else:
                        missing_jpegs.append(dest_file_with_jpeg)
                except Exception as e:
                    print(e)
            skipped += 1
            print("_______________Skipped the file: {}".format(
                file_name_with_ext))
            continue

        values = file_name.replace('_RI', '').split('_')
        try:
            genotype_gene = GenotypeModel.find_by_id(values[2])
            if genotype_gene is None:
                genotype_gene = GenotypeModel(values[2], None)
                genotype_gene.save_to_db()
            genotype_reporter = GenotypeModel.find_by_id(values[3])
            if genotype_reporter is None:
                genotype_reporter = GenotypeModel(values[3], None)
                genotype_reporter.save_to_db()
            gene_name = GeneNameModel.find_by_name(values[0])
            if gene_name is None:
                gene_name = GeneNameModel(values[0])
                gene_name.save_to_db()
            gene = GeneModel.find_by_gene_name_ids(gene_name, genotype_gene,
                                                   genotype_reporter)
            if gene is None:
                gene = GeneModel(gene_name, genotype_gene, genotype_reporter)
            experiment = ExperimentModel.find_by_name(values[1])
            if experiment is None:
                experiment = ExperimentModel(values[1])
            mani_type = ManipulationTypeModel.find_by_name(values[7])
            if mani_type is None:
                mani_type = ManipulationTypeModel(values[7])
            sex = 1
            if values[5].lower() == "f" or values[5].lower() == "female":
                sex = 0
            mouse = MouseModel.find_by_number(values[4])
            if mouse is None:
                mouse = MouseModel(values[4], sex, values[6], gene, mani_type)
            organ = OrganModel.find_by_name(values[8])
            if organ is None:
                organ = OrganModel(values[8])
            if values[14].upper() != "LSM":
                # uberon, orientation, slide_number, slice_id,
                # z_step_size=None, objective, instrument,
                # wavelength, checksum, organ, mouse,
                # experiment, combined_data, sub_folder
                slice = SliceModel(values[9], values[10], values[11],
                                   values[12], None,
                                   values[13], values[14], values[15],
                                   values[16],
                                   organ, mouse, experiment, file_name,
                                   file_sub_folder)
                slice.save_to_db()
            else:
                # uberon, orientation, slide_number=None, slice_id,
                # z_step_size, objective, instrument,
                # wavelength, checksum, organ, mouse, experiment,
                # combined_data, sub_folder
                slice = SliceModel(values[9], values[10], None, values[11],
                                   values[12],
                                   values[13], values[14], values[15],
                                   values[16],
                                   organ, mouse, experiment, file_name,
                                   file_sub_folder)
                slice.save_to_db()
            new_files += 1
            print(file)

        except PermissionError:
            p_denied += 1
            slice.delete_from_db()
        except Exception as e:
            # return "Please check the file name:
            # {}\n Exception {}\n".format(name[0:-4], str(e))
            skipped += 1
            print("Skipped the file: {}".format(file_name_with_ext))
            print("Please check the file name: {}/{}\n Exception {}\n".format(
                file_sub_folder, file_name, str(e)))

    with open(path + '/missing_jpeg_paths.txt', 'w') as file_handler:
        for item in missing_jpegs:
            file_handler.write("{}\n".format(item))

    return "<h1>Status:</h1> <br/> <h3>Skipped old files:{}</h3> <br/>" \
           "<h3>Added new files:{}</h3> <br/> " \
           "<h3>Permission denied:{}</h3><br/> <h3>JPEG(s) not found:{}</h3>" \
           "<br/> <h3>JPEG(s) has been moved to RIGHT directory:{}</h3>" \
        .format(skipped,
                new_files,
                p_denied,
                jpegs,
                moved_jpegs)



@application.route('/details/<id>/<from_url>', methods=['GET', 'POST'])
def details(id, from_url):
    slice = SliceModel.find_by_id(id)
    return render_template('details.html', slice=slice, from_url=from_url)


@application.route('/img_browser', methods=['GET', 'POST'])
def img_browser():
    gene = request.args.get("gene")
    organ = request.args.get("organ")
    experiment = request.args.get("experiment")
    sample_type = request.args.get("instrument")
    pos_mouse_number = request.args.get("pos_mouse_number")
    neg_mouse_number = request.args.get("neg_mouse_number")
    wavelength = request.args.get("wavelength")
    imgType = request.args.get("imgType")
    selected_slice = request.args.get("selected_slice")
    genes = GeneModel.find_unique_names()
    organs = OrganModel.find_all()
    experiments = ExperimentModel.find_all()
    genes = [i.to_dict() for i in genes]
    experiments = [i.to_dict() for i in experiments]
    organs = [i.to_dict() for i in organs]
    
    # return a json  of 
    return  jsonify({'genes': genes, "organs": organs, "experiments":experiments})
    # return render_template('img_browser_split.html', genes=genes, experiments=experiments, organs=organs,
    #                        gene=gene, organ=organ, experiment=experiment, sample_type=sample_type,
    #                        pos_mouse_number=pos_mouse_number, neg_mouse_number=neg_mouse_number, wavelength=wavelength, selected_slice=selected_slice,
    #                        imgType=imgType)


@application.route('/getAutoValues', methods=['GET'])
def getAutoValues(clip_hist_percent=2):
    url = request.args.get('url') + ".webp"
   
    
    # req = urllib.request.urlopen(url)
    # if req.getcode() != 200:
    #     return make_response(jsonify({'error': 'Could not download image'}), 400)
    # arr = np.asarray(bytearray(req.read()), dtype=np.uint8)  
    # img = cv2.imdecode(arr, -1).astype(np.uint8)
    url = url.replace("https://files.docking.org/", "/nfs/ex9/")
    img = cv2.imread(url).astype(np.uint8)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate grayscale histogram
    hist = cv2.calcHist([gray],[0],None,[256],[0,256])
    hist_size = len(hist)
    
    # Calculate cumulative distribution from the histogram
    accumulator = []
    accumulator.append(float(hist[0]))
    for index in range(1, hist_size):
        accumulator.append(accumulator[index -1] + float(hist[index]))
    
    # Locate points to clip
    maximum = accumulator[-1]
    clip_hist_percent *= (maximum/100.0)
    clip_hist_percent /= 2.0
    
    # Locate left cut
    minimum_gray = 0
    while accumulator[minimum_gray] < clip_hist_percent:
        minimum_gray += 1
    
    # Locate right cut
    maximum_gray = hist_size -1
    while accumulator[maximum_gray] >= (maximum - clip_hist_percent):
        maximum_gray -= 1
    
    # Calculate alpha and beta values
    alpha = 255 / (maximum_gray - minimum_gray)
    beta = -minimum_gray * alpha
    
    

    auto_result = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)
    newmin = auto_result.min()
    newmax= auto_result.max()
  
    
    return jsonify({'min': int(newmin), "max": int(newmax), "contrast":str(alpha), "brightness": str(beta)})


@application.route('/lut/<z>/<x>/<y>', methods=['GET'])
def lut(z,x,y):
    ycord = y.split(".")[0]
    if int(z) < 0 or int(x) < 0 or int(ycord) < 0:
        return make_response(jsonify({'error': 'Invalid coordinates'}), 400)
    lut = request.args.get("lut")
    url = request.args.get('url') + "/{}/{}/{}".format(z,x,y)
    print(url)
    autobrightness = request.args.get("autobrightness")
   
    # for local testing    
    # req = urllib.request.urlopen(url)
    # if req.getcode() != 200:
    #     return make_response(jsonify({'error': 'Could not download image'}), 400)
    # arr = np.asarray(bytearray(req.read()), dtype=np.uint8)  
    # img = cv2.imdecode(arr, -1).astype(np.uint8)
    
    # for production
    url = url.replace("https://files.docking.org/", "/nfs/ex9/")
    img = cv2.imread(url).astype(np.uint8)
    
    img = img[:,:,:3]
    
    
    if autobrightness != "true":
        brightness = int(request.args.get("brightness"))
        contrast = int(request.args.get("contrast"))
        cliplow = int(request.args.get("cliplow"))
        cliphigh = int(request.args.get("cliphigh"))
    
        contrast_factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

        brightness_factor = brightness - 128 * (contrast_factor - 1)
        
        img = img * contrast_factor + brightness_factor
        
        
        img = np.clip(img, cliplow, cliphigh)
    
    else:
        contrast  = 20
        brightness = -15
        
        contrast_factor = (259 * (contrast + 255)) / (255 * (259 - contrast))


        brightness_factor = brightness - 128 * (contrast_factor - 1)
        
        img = img * contrast_factor + brightness_factor
        
        img = np.clip(img, 0, 255)
            
    
        
    img = img.astype(np.uint8)
    
    if lut == "inverted":
        img = cv2.bitwise_not(img)
    
    try:
        img = cv2.LUT(img, lookuptables[lut])
    except:
        pass
    
  
    
    
       
    retval, buffer = cv2.imencode('.png', img)
    response = make_response(buffer.tobytes())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment')
    return response
    