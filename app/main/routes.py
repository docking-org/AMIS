from flask import render_template, flash, redirect, url_for, current_app, app, request, Response

from app.main import application
from app.data.models.genotype import GenotypeModel
from app.data.models.gene import GeneModel
from app.data.models.mouse import MouseModel
from app.data.models.mani_type import ManipulationTypeModel
from app.data.models.organ import OrganModel
from app.data.models.slice import SliceModel
from app.data.models.experiment import ExperimentModel
import pyexcel as pe
import csv
import os
from hurry.filesize import size, alternative
import pathlib



@application.route('/', methods=['GET'])
def index():
    return redirect(url_for('admin.index'))


@application.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':


        folder = current_app.config['FILE_UPLOAD_FOLDER']
        file = request.files['file']
        file_dir = os.path.realpath(os.path.dirname(folder))
        pathlib.Path(file_dir).mkdir(parents=True, exist_ok=True)
        file.stream.seek(0)
        filename = file_dir + "/test.csv"
        if os.path.exists(filename):
            os.remove(filename)
        file.save(os.path.join(filename))

        records = pe.iget_records(file_name=filename)
        print(records)
        line = 1
        for record in records:
            combined_values = '_'.join('{}'.format(value) for key, value in record.items()).replace(" ", "_")
            print(combined_values)
            line +=1
            #genotype = GenotypeModel.find_by_name(record['genotype'])
            try:
                genotype = GenotypeModel.find_by_id(record['genotype'])
                print(genotype)
                gene = GeneModel(record['gene'], genotype.id)
                mani_type = ManipulationTypeModel.find_by_name(record['manipulation_type'])
                if mani_type is None:
                    mani_type = ManipulationTypeModel(record['manipulation_type'])

                mouse = MouseModel(record['mouse_number'], record['sex'], record['age'], gene, mani_type)
                organ = OrganModel.find_by_name(record['organ'])
                if organ is None:
                    organ = OrganModel(record['organ'])
                experiment = ExperimentModel.find_by_name(record['experiment'])
                if experiment is None:
                    experiment = ExperimentModel(record['experiment'])
                slice = SliceModel(record['slide_number'], record['slice_id'], record['location_index'],
                                   record['resolution'], record['instrument'], record['wavelength'],
                                   record['probe_id'], record['survey_classification'], record['checksum'],
                                   organ, mouse, experiment, combined_values)
                slice.save_to_db()
            except Exception as e:
                pe.free_resources()
                return "Please check line number: {}\n Exception {}\n".format(line, str(e))
        pe.free_resources()

        # print(name)
        # print(secure_filename(name))
        # print(os.path.join(file_dir, secure_filename(name)))


        print("print post")
        return "Successfully uploaded!"
    else:
        print("print get")
        return "GET"

