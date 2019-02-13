from flask_restful import Resource, reqparse
from app.data.models.gene import GeneModel


# class Gene(Resource):
#     def get(self, name):
#         store = GeneModel.find_by_name(name)
#         if store:
#             return store.json()
#         return {'message': 'Gene not found'}, 404


class GeneList(Resource):
    def get(self):
        return {'items': [x.json() for x in GeneModel.query.all()]}