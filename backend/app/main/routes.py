from flask import render_template, request, send_file, make_response, jsonify, current_app, send_from_directory
import json
import cv2
import json
import urllib
import os
import numpy as np
from app.data.lut.lookuptables import lookuptables
from app.main import application
from app.helpers.validation import load_images
from app.data.models.slice import SliceModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.organ import OrganModel
from app.data.models.experiment import ExperimentModel


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
    return load_images()




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
    url = toPath(request.args.get('url'))
 

    url = url + "/{}/{}/{}".format(z,x,y)
    
    autobrightness = request.args.get("autobrightness")
   
    # for local testing    
    # req = urllib.request.urlopen(url)
    # if req.getcode() != 200:
    #     return make_response(jsonify({'error': 'Could not download image'}), 400)
    # arr = np.asarray(bytearray(req.read()), dtype=np.uint8)  
    # img = cv2.imdecode(arr, -1).astype(np.uint8)
    
    
    # for production
    # url = url.replace("https://files.docking.org/", "/nfs/ex9/")
    # img = cv2.imread(url).astype(np.uint8)
    
    # img = img[:,:,:3]
    
    
    # if autobrightness != "true":
    #     brightness = int(request.args.get("brightness"))
    #     contrast = int(request.args.get("contrast"))
    #     cliplow = int(request.args.get("cliplow"))
    #     cliphigh = int(request.args.get("cliphigh"))
    
    #     contrast_factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    #     brightness_factor = brightness - 128 * (contrast_factor - 1)
        
    #     img = img * contrast_factor + brightness_factor
        
        
    #     img = np.clip(img, cliplow, cliphigh)
    
    # else:
    #     contrast  = 20
    #     brightness = -15
        
    #     contrast_factor = (259 * (contrast + 255)) / (255 * (259 - contrast))


    #     brightness_factor = brightness - 128 * (contrast_factor - 1)
        
    #     img = img * contrast_factor + brightness_factor
        
    #     img = np.clip(img, 0, 255)
            
    
        
    # img = img.astype(np.uint8)
    
    # if lut == "inverted":
    #     img = cv2.bitwise_not(img)
    
    # try:
    #     img = cv2.LUT(img, lookuptables[lut])
    # except:
    #     pass
    
       
    retval, buffer = cv2.imencode('.png', img)
    response = make_response(buffer.tobytes())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment')
    return response
    
@application.route('/images/<path>/<number>/<image>', methods=['GET'])
def send_image(path,number,image):
    if path not in current_app.config['URL_MAP']:
        return make_response(jsonify({'error': 'Invalid path'}), 400)
    else:
        url = current_app.config['URL_MAP'][path] + "/" + number
        return send_from_directory(url, image)
    
def toPath(url):
    path = url.split("/")[2]
    new = current_app.config['URL_MAP'][path] 
    path = url.replace("/images/" + path, new)
    return path
        
    