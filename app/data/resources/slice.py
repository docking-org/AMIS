from flask_restful import Resource, reqparse
from app.data.models.slice import SliceModel


class SliceList(Resource):
    def get(self):
        return {'items': [x.json() for x in SliceModel.query.all()]}
