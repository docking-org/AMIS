from flask_restful import Resource, reqparse
from app.data.models.compound import CompoundModel


class Compound(Resource):
    def get(self, name):
        cmpd = CompoundModel.find_by_name(name)
        if cmpd:
            return cmpd.json()
        return {'message': 'Compound not found'}, 404


class CompoundList(Resource):
    def get(self):
        return {'items': [x.json() for x in CompoundModel.query.all()]}