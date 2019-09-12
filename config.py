import os
basedir = os.path.abspath(os.path.dirname(__file__))

from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)


class Config(object):
    SECRET_KEY = os.getenv("SECRET_KEY") or 'secret'
    SECURITY_PASSWORD_SALT = os.getenv("SECURITY_PASSWORD_SALT")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI") or 'your_db_URI'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLALCHEMY_POOL_SIZE = 20
    # SQLALCHEMY_MAX_OVERFLOW = 5
    # SQLALCHEMY_POOL_TIMEOUT = 10
    LISTS_PER_PAGE = 20
    MAX_CONTENT_LENGTH = 1024 * 1024 * 1024
    FILE_UPLOAD_FOLDER = 'app/tmp/'
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
    IMAGE_LOAD_FOLDER = os.getenv("IMAGE_LOAD_FOLDER")
    IMG_UPLOAD_FOLDER_URL = os.getenv("IMG_UPLOAD_FOLDER_URL")
    JPEG_FOLDER = os.getenv("JPEG_FOLDER")
    JPG_FOLDER = os.getenv("JPG_FOLDER")
    # Flask-User settings
    USER_APP_NAME = "A Mouse Image Server"  # Shown in and email templates and page footers

    CSRF_ENABLED = True
