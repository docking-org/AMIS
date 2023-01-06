from flask import render_template, request, send_file, make_response
import json
import cv2
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


@application.route('/', methods=['GET'])
def index(gene_name=None, organ_name=None):
    gene = request.args.get("gene")
    organ = request.args.get("organ")
    genes = GeneNameModel.find_all()
    organs = OrganModel.find_all()
    return render_template('index.html', genes=genes, organs=organs, gene_name=gene, organ_name=organ)


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
    return render_template('img_browser_split.html', genes=genes, experiments=experiments, organs=organs,
                           gene=gene, organ=organ, experiment=experiment, sample_type=sample_type,
                           pos_mouse_number=pos_mouse_number, neg_mouse_number=neg_mouse_number, wavelength=wavelength, selected_slice=selected_slice,
                           imgType=imgType)



@application.route('/lut', methods=['POST'])
def lut():
    data = json.loads(request.data.decode('utf-8'))
    type = data['type']
    
    
    # for local testing
    url = data['url']
    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)  
    
    img = cv2.imdecode(arr, -1).astype(np.uint8)
    img = img[:,:,:3]
    #url = url.replace("https://files.docking.org/", "/nfs/ex9/")
    #img = cv2.imread(url)
    
    
    
    try:
        img = cv2.LUT(img, lookuptables[type])
    except:
        pass
       
    retval, buffer = cv2.imencode('.png', img)
    response = make_response(buffer.tobytes())
    response.headers.set('Content-Type', 'image/png')
    response.headers.set(
        'Content-Disposition', 'attachment')
    return response
    