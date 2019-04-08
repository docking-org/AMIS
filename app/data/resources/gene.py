from flask_restful import Resource, reqparse
from app.data.models.gene import GeneModel
from flask import jsonify

# class Gene(Resource):
#     def get(self, name):
#         stores = GeneModel.find_by_name(name)
#         if stores:
#             return {'items': [x.json() for x in stores]}
#         return {'message': 'Gene not found'}, 404

parser = reqparse.RequestParser()


class Genes(Resource):
    def get(self, file_type=None):
        parser.add_argument('id', type=int)
        parser.add_argument('name', type=str)
        parser.add_argument('genotype_gene', type=str)
        parser.add_argument('genotype_reporter', type=str)

        args = parser.parse_args()
        new_args = {key:val for key, val in args.items() if val is not None}


        data = GeneModel.query.filter_by(**new_args).all()


        # if file_type:
        #     return Response(str(data),
        #                     mimetype='application/json',
        #                     headers={'Content-Disposition': 'attachment;filename=slices.json'})

        data = {'items': [x.to_dict() for x in data]}
        return jsonify(data)



# class GeneList(Resource):
#     def get(self):
#         return {'items': [x.to_dict() for x in GeneModel.query.all()]}