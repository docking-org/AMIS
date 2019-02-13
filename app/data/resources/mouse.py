from flask_restful import Resource, reqparse
from app.data.models.mouse import MouseModel


class MouseList(Resource):
    def get(self):
        return {'items': [x.json() for x in MouseModel.query.all()]}