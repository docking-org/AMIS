from app import db
#a subtype is a type of gene. 

class SubtypeModel(db.Model):   
    __tablename__ = 'subtype'

    id = db.Column(db.Integer, primary_key=True)
    subtype_name = db.Column(db.String(80), nullable=False)
    gene_id = db.Column(db.Integer, db.ForeignKey('gene.id'), nullable=False)
    gene = db.relationship("GeneModel", back_populates='subtypes')
    mice = db.relationship("MouseModel", back_populates='subtype')
    #subtype is a gene, contains same info as gene

  

    def __init__(self, name):
        self.name = name

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

