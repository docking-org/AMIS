from flask_restful import Resource, reqparse
from app.data.models.organ import OrganModel


class Organ(Resource):
    def get(self, name):
        organ = OrganModel.find_by_name(name)
        if organ:
            return organ.json()
        return {'message': 'Organ not found'}, 404


class OrganList(Resource):
    def get(self):
        return {'items': [x.json() for x in OrganModel.query.all()]}