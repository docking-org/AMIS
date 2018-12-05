__author__ = 'Chinzorig Dandarchuluun'
__copyright__ = ""


from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bootstrap import Bootstrap
from flask_user import UserManager, SQLAlchemyAdapter
# from flask_moment import Moment
import flask_admin
from flask_admin.contrib.sqla import ModelView
from app.data.views.model_views import DataSetView


db = SQLAlchemy()
migrate = Migrate()
bootstrap = Bootstrap()


def create_app(config_class=Config):
    application = app = Flask(__name__)
    # Menu(app=app)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    bootstrap.init_app(app)


    from app.data.models.dataset import DataSetModel
    from app.data.models.compound import CompoundModel
    from app.data.models.gene import GeneModel
    from app.data.models.operator import OperatorModel
    from app.data.models.organ import OrganModel
    from app.data.models.sample import SampleModel
    from app.data.models.scan import ScanModel

    # Create admin
    # admin = flask_admin.Admin(
    #     app,
    #     'Upload Wizard:',
    #     index_view=MyHomeView(),
    #     base_template='master.html',
    #     template_mode='bootstrap3',
    # )

    admin = flask_admin.Admin(app, name='AMIS', template_mode='bootstrap3')
    # admin.add_view(DataSetView(DataSetModel, db.session, "Dataset"))
    admin.add_view(ModelView(DataSetModel, db.session, "Dataset"))
    admin.add_view(ModelView(CompoundModel, db.session, "Compound"))
    admin.add_view(ModelView(GeneModel, db.session, "Gene"))
    admin.add_view(ModelView(OperatorModel, db.session, "Operator"))
    admin.add_view(ModelView(OrganModel, db.session, "Organ"))
    admin.add_view(ModelView(SampleModel, db.session, "Sample"))
    admin.add_view(ModelView(ScanModel, db.session, "Scan"))

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
