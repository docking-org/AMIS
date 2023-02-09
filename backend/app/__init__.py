__author__ = 'Chinzorig Dandarchuluun'
__copyright__ = ""

from flask import Flask, send_from_directory
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bootstrap import Bootstrap5
import flask_admin
import os
from app.data.views.model_views import ExperimentView, \
     SliceViewWithImages, GeneView, MouseView
#     import DataSetView, GeneView, OperatorView, OrganView, SampleView,
#     ScanView, CompoundView
from flask_restful import Api
from flask_admin.contrib.sqla import ModelView
from flask_cors import CORS
db = SQLAlchemy()
migrate = Migrate()
bootstrap = Bootstrap5()
api = Api()

app = Flask(__name__, static_folder='../../build')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

def create_app(config_class=Config):
   
    # Menu(app=app)
    app.config.from_object(config_class)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    from app.data.resources.gene import Genes
    from app.data.resources.experiment import ExperimentList
    from app.data.resources.organ import OrganList
    from app.data.resources.slice import Slices
    from app.data.resources.slice import Filters
    from app.data.resources.lookup import LookupList
    from app.data.resources.mouse import MouseList
    # from app.data.resources.scan import ScanList, Scan
    # api.add_resource(Gene, '/gene/<string:name>')
    # api.add_resource(Compound, '/compound/<string:name>')
    # api.add_resource(Operator, '/operator/<string:name>')
    # api.add_resource(Organ, '/organ/<string:name>')
    # api.add_resource(Sample, '/sample/<string:name>')
    # api.add_resource(Scan, '/scan/<string:name>')
    api.add_resource(Genes, '/genes')
    # api.add_resource(GeneList, '/genes')
    lookup_routes = [
        '/lookups',
        '/lookups.<file_type>',
    ]
    api.add_resource(LookupList, *lookup_routes)
    api.add_resource(MouseList, '/mice')
    # api.add_resource(CompoundList, '/compounds')
    # api.add_resource(OperatorList, '/operators')
    api.add_resource(OrganList, '/organs')
    api.add_resource(ExperimentList, '/experiments')
    # api.add_resource(SampleList, '/samples')
    # api.add_resource(ScanList, '/scans')
    # api.add_resource(Slice, '/slice')
    slice_routes = [
        '/slices',
        '/slices.<file_type>',
    ]
    api.add_resource(Slices, *slice_routes)
    api.add_resource(Filters, "/filters")

    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    bootstrap.init_app(app)
    cors = CORS(app)
    from app.data.models.experiment import ExperimentModel
    from app.data.models.mouse import MouseModel
    from app.data.models.gene import GeneModel
    from app.data.models.genotype import GenotypeModel
    from app.data.models.slice import SliceModel
    from app.data.models.organ import OrganModel
    from app.data.models.mani_type import ManipulationTypeModel
    from app.data.models.lookup import LookupModel


    # admin = flask_admin.Admin(
    #     app,
    #     'Upload Wizard:',
    #     index_view=MyHomeView(),
    #     base_template='master.html',
    #     template_mode='bootstrap3',
    # )

    admin = flask_admin.Admin(
        app,
        'AMIS',
        base_template='master.html',
        template_mode='bootstrap3'
    )

    admin.add_view(SliceViewWithImages(SliceModel, db.session, "Mouse Slices",
                                       endpoint='slices'))
    # admin.add_view(SliceView(SliceModel, db.session, "Slides"))
    # admin.add_view(ClearedView(SliceModel, db.session, "Cleared",
    # endpoint='cleared'))
    admin.add_view(ExperimentView(ExperimentModel, db.session, "Experiment"))
    admin.add_view(MouseView(MouseModel, db.session, "Mouse"))
    admin.add_view(GeneView(GeneModel, db.session, "Gene"))
    admin.add_view(ModelView(GenotypeModel, db.session, "Geno Type"))
    admin.add_view(ModelView(OrganModel, db.session, "Organ"))
    admin.add_view(
        ModelView(ManipulationTypeModel, db.session, "Manipulation Type"))
    admin.add_view(ModelView(LookupModel, db.session, "Lookup"))

    #
    # from app.errors import application as errors_bp
    # app.register_blueprint(errors_bp)
    #
    # # from app.api import application as api_bp
    # # app.register_blueprint(api_bp, url_prefix='/api')
    #

    from app.main import application as main_bp
    app.register_blueprint(main_bp)
    

    # Create admin

    return app
#
# from app.data import models
