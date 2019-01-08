from flask import render_template, flash, redirect, url_for, current_app, app, request, Response

from app.main import application
from app.helpers.validation import save_excel_records, save_file_list
from app.data.models.slice import SliceModel
import pyexcel as pe
import os
import pathlib



@application.route('/', methods=['GET'])
def index():
    return redirect(url_for('admin.index'))


@application.route('/upload/<type>', methods=['GET', 'POST'])
def upload_file(type):
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
        save_excel_records(type, records, pe)
        pe.free_resources()

        print("print post")
        return "Successfully uploaded!\n"
    else:
        print("print get")
        return "GET"


@application.route('/reloadimages', methods=['GET', 'POST'])
def reload():
    ret = "Error!"
    try:
        folder = current_app.config['IMAGE_LOAD_FOLDER']
        file_dir = os.path.realpath(os.path.dirname(folder))
        lst = os.listdir(file_dir)
        ret = save_file_list(lst)
    except OSError:
        print("error!")
        pass  # ignore errors
    else:
        pass
    return ret


@application.route('/details/<slice_id>', methods=['GET', 'POST'])
def details(slice_id):
    slice = SliceModel.find_by_slice_id(slice_id)
    return render_template('details.html', slice=slice)