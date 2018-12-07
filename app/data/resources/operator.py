from flask_restful import Resource, reqparse
from app.data.models.operator import OperatorModel


class Operator(Resource):
    def get(self, name):
        operator = OperatorModel.find_by_name(name)
        if operator:
            return operator.json()
        return {'message': 'Operator not found'}, 404


class OperatorList(Resource):
    def get(self):
        return {'items': [x.json() for x in OperatorModel.query.all()]}