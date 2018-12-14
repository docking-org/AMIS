from app import db
from flask import current_app
from sqlalchemy import Index


class SliceModel(db.Model):
    __tablename__ = 'slice'

    id = db.Column(db.Integer, primary_key=True)
    slide_number = db.Column(db.Integer)
    slice_id = db.Column(db.Integer)
    location_index = db.Column(db.String(200))
    resolution = db.Column(db.String(200))
    instrument = db.Column(db.String(200))
    wavelength = db.Column(db.Integer)
    probe_id = db.Column(db.String(200))
    survey_classification = db.Column(db.String(200))
    checksum = db.Column(db.String(200))
    img_path = db.Column(db.String(500), nullable=True)
    organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=False)
    organ = db.relationship("OrganModel", back_populates='slices')
    mouse_id = db.Column(db.Integer, db.ForeignKey('mouse.id'))
    mouse = db.relationship("MouseModel", back_populates="slices")
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.id'), nullable=False)
    experiment = db.relationship("ExperimentModel", back_populates="slices")
    combined_data = db.Column(db.String(800), unique=True)

    def __init__(self, slide_number, slice_id, location_index, resolution, instrument, wavelength, probe_id,
                 survey_classification, checksum, organ, mouse, experiment, combined_data):
        self.slide_number = slide_number
        self.slice_id = slice_id
        self.location_index = location_index
        self.resolution = resolution
        self.instrument = instrument
        self.wavelength = wavelength
        self.probe_id = probe_id
        self.survey_classification = survey_classification
        self.checksum = checksum
        self.organ = organ
        self.mouse = mouse
        self.experiment = experiment
        self.combined_data = combined_data

    def json(self):
        return {'id': self.id, 'slide_number': self.slide_number}

    @property
    def url(self):
        return current_app.config['IMG_UPLOAD_FOLDER_URL'] + self.img_path

    @classmethod
    def find_by_name(cls, number):
        return cls.query.filter_by(name=number).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def __str__(self):
        return self.slide_number

    def __repr__(self):
        return '<Slice {}>'.format(self.slide_number)
