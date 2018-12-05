from flask import render_template, flash, redirect, url_for, current_app, app, request, Response

from app.main import application


@application.route('/', methods=['GET'])
def index():
    # return render_template('index.html')
    return redirect(url_for('admin.index'))
