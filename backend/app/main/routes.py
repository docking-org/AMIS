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
from app.data.models.feedback import FeedbackModel
from app import db

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

@application.route('/loadimages/<path>/<folder>', methods=['GET', 'POST'])
def image_load(path = None, folder = None):
    # folder = current_app.config['IMAGE_LOAD_FOLDER']
    # file_dir = os.path.realpath(os.path.dirname(folder))
    # lst = os.listdir(file_dir)
    # ret = save_file_list(lst)
    if path and folder:
        url = current_app.config['URL_MAP'][path] + "/" + folder
        print(url)
        return load_images(url)
    else:
        return make_response(jsonify({'error': 'Could not download image'}), 400)

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
    # url = toPath(request.args.get('url')) + '/0/0/0.png'
    # print(url)
    # reader = png.Reader(url )
    # pngdata = reader.read()
    # px_array = np.array( map( np.uint16, pngdata[2] ))
    # print( px_array.dtype )

    # #open image as 16 bit
    # img = cv2.imread(url, cv2.IMREAD_UNCHANGED).astype(np.uint16)
    # img = img*16
    # print(img)
    
    
    return jsonify({'min': int(0), "max": int(img.max()), "contrast":str(3), "brightness": str(3)})


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
    
    img = cv2.imread(url, -1)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype(np.uint16)
    img = img * 257
    
    opacityThreshold = float(request.args.get("opacityThreshold"))* 65535 / 100
    
    img[img < opacityThreshold] = 0
    
    if autobrightness != "true":
        
        cliplow = float(request.args.get("cliplow"))  * 65535 / 100
        cliphigh = float(request.args.get("cliphigh"))    * 65535 / 100
        print(cliplow)
        print(cliphigh)
      
        #brightness is a number from -65535 to 65535
        #contrast is a number from 0 to 32767. 0 being no contrast, 32767 being max contrast
           
        img = np.where(img < cliplow, 0, img)
        img = np.where(img > cliphigh, 65535, img)
        brightness =(float(request.args.get("brightness")))
        contrast = 1 + (float(request.args.get("contrast")) / 65535 * 2)
        img = cv2.addWeighted(img, contrast, img, 0 , brightness)

    


    
   
    
    img = img.astype(np.uint8)
    if lut == "inverted":
        img = cv2.bitwise_not(img)
    elif lut == "grayscale":
        pass
    else: 
        try:
           
            img = cv2.LUT(img, lookuptables[lut])
        except e:
            print(e)
            pass

    
    
    #make all black pixels transparent
    img = cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)
    img[np.all(img == [0, 0, 0, 255], axis=2)] = [0, 0, 0, 0]
    

    retval, buffer = cv2.imencode('.png', img)
    response = make_response(buffer.tobytes())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment')
    return response

@application.route('/images/<path>/<number>/<image>/<x>/<y>/<z>.png', methods=['GET'])
def send_slice(path,number,image, x, y, z):
    if path not in current_app.config['URL_MAP']:
        return make_response(jsonify({'error': 'Invalid path'}), 400)
    else:
        url = current_app.config['URL_MAP'][path] + "/" + number + "/" + image + "/" + x + "/" + y + "/"
        
        #convert from 0 based to 1 based
        
        return send_from_directory(url, '0.png')
    
@application.route('/images/<path>/<number>/<image>', methods=['GET'])
def send_image(path,number,image):
    if image.split(".")[1] == "webp" and not os.path.exists(current_app.config['URL_MAP'][path] + "/" + number + "/" + image):
        image = image.split(".")[0] + ".png"
        
        
    if path not in current_app.config['URL_MAP']:
        return make_response(jsonify({'error': 'Invalid path'}), 400)
    else:
        url = current_app.config['URL_MAP'][path] + "/" + number

        if not os.path.exists(url + "/" + image):
            for path in current_app.config['URL_MAP']:
                if os.path.exists(current_app.config['URL_MAP'][path] + "/" + number + "/" + image):
                    url = current_app.config['URL_MAP'][path] + "/" + number
                    break

        img = cv2.imread(url + "/" + image, -1)
        #if single channel, convert to 3 channel
        
        if len(img.shape) == 2:
            img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = img.astype(np.uint8)
            retval, buffer = cv2.imencode('.png', img)
            
            cv2.imwrite(url + "/" + image.split(".")[0] + ".webp", img)
            

            response = make_response(buffer.tobytes())
            response.headers.set('Content-Type', 'image/png')
            response.headers.set(
                'Content-Disposition', 'attachment')
            return response
        else:
            return send_from_directory(url, image)        

    
            
    
def toPath(url):
    path = url.split("/")[2]
    new = current_app.config['URL_MAP'][path] 
    path = url.replace("/images/" + path, new)
    return path
        

@application.route('/submitFeedback', methods=['POST'])
def submitFeedback():

    data = request.get_json()
    
    feedback = data["feedback"]
    contact_info = data["contactInfo"]
    
    if feedback == "":
        return make_response(jsonify({'error': 'Feedback cannot be empty'}), 400)
    else:
        fb = FeedbackModel(feedback=feedback, contact_info=contact_info)
        db.session.add(fb)
        db.session.commit()
        return make_response(jsonify({'success': 'Feedback submitted'}), 200)
        