from flask_restful import Resource, reqparse
from app.data.models.scan import ScanModel


class Scan(Resource):
    def get(self, name):
        scan = ScanModel.find_by_name(name)
        if scan:
            return scan.json()
        return {'message': 'Scan not found'}, 404


class ScanList(Resource):
    def get(self):
        return {'items': [x.json() for x in ScanModel.query.all()]}