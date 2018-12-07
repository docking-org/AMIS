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


class DataSetView(sqla.ModelView):
    column_list = ['id', 'img_path', 'date', 'gene', 'compound', 'organ', 'operator', 'sample', 'scan']
    # form_columns = ('active', 'roles', 'username', 'short_name', 'email', 'company')
    # column_searchable_list = ('username', 'email')
    # column_editable_list = ('active', 'email', 'company')
    # page_size = 20
    column_formatters = {
        'date': _date_format,
        'img_path': _list_thumbnail
    }


class CompoundView(sqla.ModelView):
    column_list = ['zinc_id']
    form_columns = ('zinc_id',)


class GeneView(sqla.ModelView):
    column_list = ['name', 'symbol']
    form_columns = ('name', 'symbol')


class OperatorView(sqla.ModelView):
    column_list = ['name', 'email']
    form_columns = ('name', 'email')


class OrganView(sqla.ModelView):
    column_list = ['name', 'description']
    form_columns = ('name', 'description')


class SampleView(sqla.ModelView):
    column_list = ['description']
    form_columns = ('description',)


class ScanView(sqla.ModelView):
    column_list = ['description', 'date']
    form_columns = ('description', 'date')

    column_formatters = {
        'date': _date_format
    }
