from flask_user import current_user
from flask import url_for, redirect, request, abort
from flask_admin import AdminIndexView, expose, BaseView
from flask import Markup
from datetime import timezone
from flask_admin.contrib import sqla


def _list_thumbnail(view, context, model, name):
    if not model.img_path:
        return ''

    return Markup(
        '<img src="{model.url}" style="height: 40px;">'.format(model=model)
    )


def utc_to_local(utc_dt):
    return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None)


def _date_format(view, context, model, name):
    if not model.date:
        return ''

    return utc_to_local(model.date).strftime("%b %d %Y %H:%M")


class ExperimentView(sqla.ModelView):
    column_list = ['name', 'description']
    form_columns = ('name', 'description')
    column_editable_list = ('name', 'description')
    # form_columns = ('active', 'roles', 'username', 'short_name', 'email', 'company')
    # column_searchable_list = ('username', 'email')
    # column_editable_list = ('active', 'email', 'company')
    # page_size = 20
    # column_formatters = {
    #     'date': _date_format,
    #     'img_path': _list_thumbnail
    # }

# slide_number = db.Column(db.Integer)
#     slice_id = db.Column(db.Integer)
#     location_index = db.Column(db.String(200))
#     resolution = db.Column(db.String(200))
#     instrument = db.Column(db.String(200))
#     wavelength = db.Column(db.Integer)
#     probe_id = db.Column(db.String(200))
#     survey_classification = db.Column(db.String(200))
#     checksum = db.Column(db.String(200))
#     img_path = db.Column(db.String(500), nullable=True)
#     organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=False)
#     organ = db.relationship("OrganModel", back_populates='slices')
#     mouse_id = db.Column(db.Integer, db.ForeignKey('mouse.id'))
#     mouse = db.relationship("MouseModel", back_populates="slices")
#     experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.id'), nullable=False)
#     experiment = db.relationship("ExperimentModel", back_populates="slices")

class SliceView(sqla.ModelView):
    column_list = ['mouse.gene.name', 'experiment.name', 'mouse.gene.genotype.type_id',
                   'mouse.number', 'mouse.sex', 'mouse.age', 'mouse.mani_type.type',
                   'slide_number', 'slice_id', 'location_index', 'resolution', 'instrument',
                   'wavelength', 'probe_id', 'survey_classification', 'checksum']
    column_labels = {'mouse.gene.name': 'Gene', 'experiment.name': 'Experiment',
                     'mouse.gene.genotype.type_id': 'Genotype',
                     'mouse.number': 'Mouse number', 'mouse.sex': 'Sex', 'mouse.age': 'Age',
                     'mouse.mani_type.type': 'Manip type',
                     'slide_number': 'Slide number', 'slice_id': 'Slide ID',
                     'location_index': 'Loc index', 'resolution': 'Res', 'instrument': 'Inst',
                     'wavelength': 'Wave length', 'probe_id': 'Probe ID',
                     'survey_classification': 'Survey Class', 'checksum': 'Checksum'}

# class GeneView(sqla.ModelView):
#     column_list = ['id', 'name']
#     form_columns = ('id', 'name')
#
#
# class OperatorView(sqla.ModelView):
#     column_list = ['name', 'email']
#     form_columns = ('name', 'email')
#
#
# class OrganView(sqla.ModelView):
#     column_list = ['name', 'description']
#     form_columns = ('name', 'description')
#
#
# class SampleView(sqla.ModelView):
#     column_list = ['description']
#     form_columns = ('description',)

#
# class ScanView(sqla.ModelView):
#     column_list = ['description', 'date']
#     form_columns = ('description', 'date')
#
#     column_formatters = {
#         'date': _date_format
#     }
