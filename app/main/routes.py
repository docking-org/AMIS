from flask import render_template, flash, redirect, url_for, current_app, app, request, Response

from app.main import application
from app.data.models.gene import GeneModel


@application.route('/', methods=['GET'])
def index():
    # return render_template('index.html')
    return redirect(url_for('admin.index'))


# @application.route('/gene/list', methods=['GET'])
# def search():
#     all_genes = GeneModel.find_all();
#     return "hi"