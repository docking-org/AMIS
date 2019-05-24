from flask import render_template, flash, redirect, url_for, current_app, app, request, Response

from app.main import application
from app.helpers.validation import load_images
from app.data.models.slice import SliceModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.organ import OrganModel
from app.data.models.mouse import MouseModel
from app.data.models.experiment import ExperimentModel
import pyexcel as pe
import os
import pathlib
from flask_user import roles_required


@application.route('/<gene_name>/<organ_name>', methods=['GET'])
@application.route('/<gene_name>', methods=['GET'])
@application.route('/', methods=['GET'])
def index(gene_name=None, organ_name=None):
    genes = GeneNameModel.find_all()
    organs = OrganModel.find_all()
    return render_template('index.html', genes=genes, organs=organs, gene_name=gene_name, organ_name=organ_name)


@application.route('/slice', methods=['GET'])
def slice():
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
    gene_name = request.args.get("gene_name")
    organ_name = request.args.get("organ_name")
    print(gene_name)
    print(organ_name)
    genes = GeneModel.find_unique_names()
    organs = OrganModel.find_all()
    experiments = ExperimentModel.find_all()
    return render_template('img_browser.html', genes=genes, organs=organs, experiments=experiments, gene_name=gene_name, organ_name=organ_name)

