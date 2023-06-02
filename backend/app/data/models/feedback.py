# a table with three columns: id, feedback, and contact_info

from app import db


class FeedbackModel(db.Model):
    __tablename__ = 'feedback'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=True)
    feedback = db.Column(db.String(500), nullable=False)
    contact_info = db.Column(db.String(500), nullable=True)

    def __init__(self, feedback, contact_info):

        self.feedback = feedback
        self.contact_info = contact_info
        
        

    def to_dict(self):
        return {'id': self.id, 'feedback': self.feedback}