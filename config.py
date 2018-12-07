import os
# basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SECRET_KEY = os.getenv("SECRET_KEY") or 'secret'
    SECURITY_PASSWORD_SALT = os.getenv("SECURITY_PASSWORD_SALT")
    # SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://amis_user:amis1@yod.cluster.ucsf.bkslab.org:5432/amis'
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://amis_user:amis1@yod.compbio.ucsf.edu:5432/amis'
    #                               # 'sqlite:///' + os.path.join(basedir, 'app.db')
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              # 'sqlite:///' + os.path.join(basedir, 'app.db')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLALCHEMY_POOL_SIZE = 20
    # SQLALCHEMY_MAX_OVERFLOW = 5
    # SQLALCHEMY_POOL_TIMEOUT = 10
    LISTS_PER_PAGE = 20
    MAX_CONTENT_LENGTH = 1024 * 1024 * 1024
    UPLOAD_FOLDER = '/nfs/ex9/idg-images'
    IMG_UPLOAD_FOLDER_URL = 'http://files.docking.org/idg-images/'

    # Flask-User settings
    USER_APP_NAME = "A Mouse Image Server"  # Shown in and email templates and page footers

    CSRF_ENABLED = True
