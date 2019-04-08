__author__ = 'Chinzorig Dandarchuluun'
__copyright__ = ""


from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bootstrap import Bootstrap
import flask_admin
from app.data.views.model_views import ExperimentView, SliceView, ClearedView, SliceViewWithImages, GeneView, MouseView
#     import DataSetView, GeneView, OperatorView, OrganView, SampleView, ScanView, CompoundView
from flask_restful import Api
from flask_admin.contrib.sqla import ModelView


db = SQLAlchemy()
migrate = Migrate()
bootstrap = Bootstrap()
api = Api()


def create_app(config_class=Config):
    application = app = Flask(__name__)
    # Menu(app=app)
    app.config.from_object(config_class)

    # from app.data.resources.compound import CompoundList, Compound
    from app.data.resources.gene import Genes
    from app.data.resources.experiment import ExperimentList
    from app.data.resources.organ import OrganList
    from app.data.resources.slice import Slices
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
    api.add_resource(MouseList, '/mice')
    # api.add_resource(CompoundList, '/compounds')
    # api.add_resource(OperatorList, '/operators')
    api.add_resource(OrganList, '/organs')
    api.add_resource(ExperimentList, '/experiments')
    # api.add_resource(SampleList, '/samples')
    # api.add_resource(ScanList, '/scans')
    #
    # api.add_resource(Slice, '/slice')
    slice_routes = [
        '/slices',
        '/slices.<file_type>',
    ]
    api.add_resource(Slices, *slice_routes)

    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    bootstrap.init_app(app)

    from app.data.models.experiment import ExperimentModel
    from app.data.models.mouse import MouseModel
    from app.data.models.gene import GeneModel
    from app.data.models.genotype import GenotypeModel
    from app.data.models.slice import SliceModel
    from app.data.models.organ import OrganModel
    from app.data.models.mani_type import ManipulationTypeModel

    # Create admin
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

    admin.add_view(SliceViewWithImages(SliceModel, db.session, "Mouse Slices", endpoint='slices'))
    # admin.add_view(SliceView(SliceModel, db.session, "Slides"))
    # admin.add_view(ClearedView(SliceModel, db.session, "Cleared", endpoint='cleared'))
    admin.add_view(ExperimentView(ExperimentModel, db.session, "Experiment"))
    admin.add_view(MouseView(MouseModel, db.session, "Mouse"))
    admin.add_view(GeneView(GeneModel, db.session, "Gene"))
    admin.add_view(ModelView(GenotypeModel, db.session, "Geno Type"))
    admin.add_view(ModelView(OrganModel, db.session, "Organ"))
    admin.add_view(ModelView(ManipulationTypeModel, db.session, "Manipulation Type"))

    # # Add model views
    # admin.add_view(HistoryView(UploadHistoryModel, db.session, "History"))
    # admin.add_view(CompanyView(CompanyModel, db.session, "Companies"))
    # admin.add_view(UserView(UserModel, db.session, "Users"))
    #
    # from app.errors import application as errors_bp
    # app.register_blueprint(errors_bp)
    #
    # # from app.api import application as api_bp
    # # app.register_blueprint(api_bp, url_prefix='/api')
    #

    from app.main import application as main_bp
    app.register_blueprint(main_bp)

    return app

from app.data import models