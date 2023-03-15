from app import db
from flask import current_app, url_for
import re

class PaginatedAPIMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        if per_page == -1:
            return {'items': [item.to_dict() for item in query.all()]}
        else:
            resources = query.paginate(page, per_page, False)
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page,
                                **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page,
                                **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page,
                                **kwargs) if resources.has_prev else None
            }
        }
        return data

    @staticmethod
    def to_menu_filter_dict(query):
        L = [item.to_menu_dict() for item in query.all()]
        return {'items': list({v['unique']: v for v in L}.values())}


class SliceModel(PaginatedAPIMixin, db.Model):
    __tablename__ = 'slice'

    id = db.Column(db.Integer, primary_key=True)
    uberon = db.Column(db.String(200), nullable=True)
    orientation = db.Column(db.String(200), nullable=True)
    slide_number = db.Column(db.String(200), nullable=True)
    slice_id = db.Column(db.String(200))
    z_step_size = db.Column(db.Float, nullable=True)  # Only for Cleared
    objective = db.Column(db.String(200))
    instrument = db.Column(db.String(200))
    wavelength = db.Column(db.String(200))
    checksum = db.Column(db.String(200))
    img_path = db.Column(db.String(500), nullable=True)
    organ_id = db.Column(db.Integer, db.ForeignKey('organ.id'), nullable=False)
    organ = db.relationship("OrganModel", back_populates='slices')
    mouse_id = db.Column(db.Integer, db.ForeignKey('mouse.id'))
    mouse = db.relationship("MouseModel", back_populates="slices")
    experiment_id = db.Column(db.Integer,
                              db.ForeignKey('experiment.id'),
                              nullable=False)
    experiment = db.relationship("ExperimentModel", back_populates="slices")
    orientation = db.Column(db.String(200), nullable=True)
    combined_data = db.Column(db.String(800), unique=True)

    def __init__(self, uberon, orientation, slide_number, slice_id,
                 z_step_size, objective, instrument,
                 wavelength, checksum, organ, mouse,
                 experiment, combined_data, img_path):
        self.slide_number = slide_number
        self.slice_id = slice_id
        self.uberon = uberon
        self.orientation = orientation
        self.z_step_size = z_step_size
        self.objective = objective
        self.instrument = instrument
        self.wavelength = wavelength
        self.checksum = checksum
        self.organ = organ
        self.mouse = mouse
        self.experiment = experiment
        self.combined_data = combined_data
        self.img_path = img_path

    def to_dict(self):
        data = {
            'id': self.id,
            'gene': self.mouse.gene.gene_name.name,
            'experiment': self.experiment.name,
            'genotype_gene': self.mouse.gene.genotype_gene.type_id,
            'genotype_reporter': self.mouse.gene.genotype_reporter.type_id,
            'mouse_number': self.mouse.number,
            'sex': self.mouse.sex_string,
            'age': self.mouse.age,
            'mani_type': self.mouse.mani_type.type,
            'organ': self.organ.name,
            'uberon': self.uberon,
            'orientation': self.orientation,
            'slice_id': self.slice_id,
            'slide_number': self.slide_number,
            'z_step_size': self.z_step_size,
            'objective': self.objective,
            'instrument': self.instrument,
            'wavelength': self.wavelength,
            'checksum': self.checksum,
            # 'img_url': self.img,
            'img_no_ext': self.img_no_ext,
            'img_small': self.img_small,
            'img_small_RI': self.img_small_RI,
            'img_big': self.img_big,
            'img_big_RI': self.img_big_RI,
            'tif_url': self.tif
        }
        return data

    def to_menu_dict(self):
        data = {
            'unique': self.mouse.gene.gene_name.name + self.experiment.name +
                      self.organ.name +
                      ("Cleared" if self.instrument.upper() == "LSM" else "Histological"),
            'gene': self.mouse.gene.gene_name.name,
            'experiment': self.experiment.name,
            'organ': self.organ.name,
            'sample_type': "Cleared" if self.instrument.upper() == "LSM" else "Histological",
        }
        return data
    
    
    def get_url(self, url):
        for key in current_app.config['DIRECTORY_MAP']:
            print(key)
            if re.search(key, url):
                url = re.sub(key, current_app.config['DIRECTORY_MAP'][key], url)
        return url
    
    @property
    def img_no_ext(self):
        url = self.get_url(self.img_path)
        
        return "{}/{}".format(url, self.combined_data)

    @property
    def img_small(self):
        url = self.get_url(self.img_path)
        return "{}/{}.webp".format(url, self.combined_data)

    @property
    def img_small_RI(self):
        if self.wavelength == "DAPI":
            return ""
        
        return "{}_RI.webp".format(self.combined_data)

    @property
    def img_big(self):
        url = self.get_url(self.img_path)
        return "{}/{}.jpg".format(url, self.combined_data)

    @property
    def img_big_RI(self):
        if self.wavelength == "DAPI":
            return ""
        return "{}_RI.jpg".format(self.combined_data)

    @property
    def tif(self):
        url = self.get_url(self.img_path)
        return "{}/{}.tif".format(url, self.combined_data)

    @classmethod
    def find_img_by_checksum(cls, checksum):
        slice = cls.query.filter_by(checksum=checksum).first()
        if slice:
            if slice.wavelength == "tdTomato":
                return slice.img_small_RI
            else:
                return slice.img_small
        else:
            return url_for('static', filename='images/no_image.png')

    @classmethod
    def isRegistered(cls, fileName):
        if cls.query.filter_by(combined_data=fileName).count() > 0:
            return True
        else:
            return False

    @classmethod
    def find_by_kwargs(cls, **kwargs):
        return cls.query.filter_by(**kwargs)

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
