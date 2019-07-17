from flask_user import current_user
from flask import url_for, redirect, request, abort
from flask_admin import AdminIndexView, expose, BaseView
from flask import Markup
from datetime import timezone
from flask_admin.contrib import sqla
from flask_admin.contrib.sqla.filters import BaseSQLAFilter
from flask_admin.contrib.sqla.filters import BooleanEqualFilter


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


def _file_name_link(view, context, model, name):
    if not model.id:
        return ''

    return Markup(
        '<a href="/details/{model.id}/admin">{model.id}</a>'.format(model=model)
    )


def _list_thumbnail(view, context, model, name):
    if not model.img_colored_sm:
        return ''

    return Markup(
        '<img src="{model.img_colored_sm}" style="height: 70px;">'.format(model=model)
    )


class SliceViewWithImages(sqla.ModelView):
    column_list = ['id', 'img_colored_sm', 'slice_id', 'slide_number', 'mouse.number',
                   'mouse.sex_string', 'mouse.age']
    column_labels = {'img_colored_sm': 'Image', 'slice_id': 'Slice ID', 'mouse.number': 'Mouse #',
                   'mouse.sex_string': 'Sex', 'mouse.age': 'Age'}
    column_searchable_list = ('slice_id', 'slide_number', 'mouse.number', 'mouse.age',)
    page_size = 20
    # can_create = False
    # can_delete = False
    # can_edit = False
    column_formatters = {
        'img_colored_sm': _list_thumbnail,
        'id': _file_name_link
    }


class SliceView(sqla.ModelView):
    def get_query(self):
        return self.session.query(self.model).filter(self.model.slide_number != None)

    column_list = ['mouse.gene.gene_name.name', 'experiment.name', 'mouse.gene.genotype_gene.type_id',
                   'mouse.gene.genotype_reporter.type_id', 'mouse.number', 'mouse.sex_string',
                   'mouse.age', 'mouse.mani_type.type', 'organ.name', 'orientation', 'slide_number',
                   'slice_id', 'objective', 'instrument',
                   'wavelength', 'probe_id', 'survey_classification', 'checksum']
    column_labels = {'mouse.gene.gene_name.name': 'Gene', 'experiment.name': 'Experiment',
                     'mouse.gene.genotype_gene.type_id': 'Genotype Gene',
                     'mouse.gene.genotype_reporter.type_id': 'Genotype Reporter',
                     'mouse.number': 'Mouse number', 'mouse.sex_string': 'Sex', 'mouse.age': 'Age',
                     'mouse.mani_type.type': 'Manip type', 'organ.name': 'Organ', 'orientation': 'Orientation',
                     'slide_number': 'Slide number', 'slice_id': 'Slide ID',
                     'objective': 'Res', 'instrument': 'Inst',
                     'wavelength': 'Wave length', 'probe_id': 'Probe ID',
                     'survey_classification': 'Survey Class', 'checksum': 'Checksum'}


class ClearedView(sqla.ModelView):
    def get_query(self):
        return self.session.query(self.model).filter(self.model.sample_number != None)

    column_list = ['mouse.gene.gene_name.name', 'experiment.name', 'mouse.gene.genotype_gene.type_id',
                   'mouse.gene.genotype_reporter.type_id', 'mouse.number', 'mouse.sex_string',
                   'mouse.age', 'mouse.mani_type.type', 'organ.name', 'sample_number',
                   'slice_id', 'objective', 'instrument',
                   'wavelength', 'probe_id', 'survey_classification', 'checksum']
    column_labels = {'mouse.gene.gene_name.name': 'Gene', 'experiment.name': 'Experiment',
                     'mouse.gene.genotype_gene.type_id': 'Genotype Gene',
                     'mouse.gene.genotype_reporter.type_id': 'Genotype Reporter',
                     'mouse.number': 'Mouse number', 'mouse.sex_string': 'Sex', 'mouse.age': 'Age',
                     'mouse.mani_type.type': 'Manip type', 'organ.name': 'Organ',
                     'sample_number': 'Sample number', 'slice_id': 'Slide ID',
                     'objective': 'Res', 'instrument': 'Inst',
                     'wavelength': 'Wave length', 'probe_id': 'Probe ID',
                     'survey_classification': 'Survey Class', 'checksum': 'Checksum'}


class GeneView(sqla.ModelView):
    column_list = ['id', 'gene_name.name', 'genotype_gene.type_id', 'genotype_reporter.type_id']
    # form_columns = ('id', 'name', 'genotype_gene.type_id', 'genotype_reporter.type_id')
    column_labels = {'genotype_gene.type_id': 'Genotype', 'genotype_reporter.type_id': 'Genotype Reporter'}
    column_searchable_list = ('gene_name.name',)
    # can_create = False
    # can_delete = False
    # can_edit = False

class MouseView(sqla.ModelView):
    column_list = ['gene.gene_name.name', 'mani_type.type', 'number', 'sex_string', 'age']
    column_labels = {'gene.gene_name.name':'Gene', 'mani_type.type':'Manipulation Type', 'sex_string':'Sex'}
    page_size = 20
    # can_create = False
    # can_delete = False
    # can_edit = False
