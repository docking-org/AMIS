from app import db
from flask import current_app
from sqlalchemy import Index


class SliceModel(db.Model):
    __tablename__ = 'slice'

    id = db.Column(db.Integer, primary_key=True)
    slide_number = db.Column(db.Integer, nullable=True)  # Only for Slides
    sample_number = db.Column(db.Integer, nullable=True)  # Only for Cleared
    slice_id = db.Column(db.Integer)
    uberon = db.Column(db.String(200), nullable=True)
    orientation = db.Column(db.String(200), nullable=True)  # Only for Slides
    location_index = db.Column(db.String(200), nullable=True)  # Only for Slides
    z_step_size = db.Column(db.Float, nullable=True)  # Only for Cleared
    resolution = db.Column(db.String(200))
    instrument = db.Column(db.String(200))
    wavelength = db.Column(db.String(200))
    probe_id = db.Column(db.String(200), nullable=True)
    survey_classification = db.Column(db.String(200), nullable=True)
    checksum = db.Column(db.String(200))
    img_path = db.Column(db.String(500), nullable=True)
    organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=False)
    organ = db.relationship("OrganModel", back_populates='slices')
    mouse_id = db.Column(db.Integer, db.ForeignKey('mouse.id'))
    mouse = db.relationship("MouseModel", back_populates="slices")
    experiment_id = db.Column(db.Integer, db.ForeignKey('experiment.id'), nullable=False)
    experiment = db.relationship("ExperimentModel", back_populates="slices")
    combined_data = db.Column(db.String(800), unique=True)

    def __init__(self, slide_number, sample_number, slice_id, uberon, orientation, location_index, z_step_size,
                 resolution, instrument, wavelength, probe_id, survey_classification, checksum, organ,
                 mouse, experiment, combined_data):
        self.slide_number = slide_number
        self.sample_number = sample_number
        self.slice_id = slice_id
        self.uberon = uberon
        self.orientation = orientation
        self.location_index = location_index
        self.z_step_size = z_step_size
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
        return {'id': self.id, 'gene': self.mouse.gene.name, 'experiment': self.experiment.name,
         'genotype_gene': self.mouse.gene.genotype_gene.type_id,
         'genotype_reporter': self.mouse.gene.genotype_reporter.type_id,
         'mouse_number': self.mouse.number, 'sex': self.mouse.sex_string, 'age': self.mouse.age,
         'mani_type': self.mouse.mani_type.type, 'organ': self.organ.name, 'uberon': self.uberon,
         'orientation': self.orientation, 'slice_id': self.slice_id,'z_step_size': self.z_step_size,
         'resolution': self.location_index, 'instrument': self.instrument, 'wavelength': self.wavelength,
         'probe_id': self.probe_id, 'survey_classification': self.survey_classification,
                'img_url': self.img, 'tif_url': self.tif}

    @property
    def img(self):
        return "{}bob_upload/{}.png".format(current_app.config['IMG_UPLOAD_FOLDER_URL'], self.combined_data)

    @property
    def tif(self):
        return "{}bob_upload/{}.tif".format(current_app.config['IMG_UPLOAD_FOLDER_URL'], self.combined_data)

    @classmethod
    def isRegistered(cls, fileName):
        if cls.query.filter_by(combined_data=fileName).count() > 0:
           return True
        else:
            return False

    # @property
    # def url(self):
    #     return current_app.config['IMG_UPLOAD_FOLDER_URL'] + self.img_path

    # @classmethod
    # def slides(cls):
    #     return cls.query.filter_by(cls.slide_number.isnot(None))
    #
    # @classmethod
    # def cleared(cls):
    #     return cls.query.filter_by(cls.sample_number.isnot(None))

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

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
        return self.id

    def __repr__(self):
        return '<Slice {}>'.format(self.id)
