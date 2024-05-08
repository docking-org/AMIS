from app import db
#a subtype is a type of gene. 

class DisplayOptionsModel(db.Model):
    __tablename__ = 'display_options'

    slice_fk = db.Column(db.Integer, db.ForeignKey('slice.id'), primary_key=True)
    slice = db.relationship("SliceModel", back_populates='display_options')
    min = db.Column(db.Float, nullable=False)
    max = db.Column(db.Float, nullable=False)
    brightness = db.Column(db.Float, nullable=False)
    contrast_min = db.Column(db.Float, nullable=False)
    contrast_max = db.Column(db.Float, nullable=False)

    def __init__(self, slice_fk, min, max, brightness, contrast_min, contrast_max):
        self.slice_fk = slice_fk
        self.min = min
        self.max = max
        self.brightness = brightness
        self.contrast_min = contrast_min
        self.contrast_max = contrast_max

    def to_dict(self):
        return {
            'slice_fk': self.slice_fk,
            'min': self.min,
            'max': self.max,
            'brightness': self.brightness,
            'contrast_min': self.contrast_min,
            'contrast_max': self.contrast_max,
        }
        