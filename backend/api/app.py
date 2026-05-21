import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from api.models import db, User, Property, Incidence
from api.commands import setup_commands

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///triage.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)
setup_commands(app)
CORS(app)

@app.route('/incidences', methods=['POST'])
def create_incidence():
    data = request.get_json()
    new_incidence = Incidence(
        title=data['title'], 
        description=data['description'],
        tenant_id=data['tenant_id'],
        property_id=data['property_id']
    )
    db.session.add(new_incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia creada"}), 201

@app.route('/incidences', methods=['GET'])
def get_incidences():
    incidences = Incidence.query.all()
    incidences_list = [{
        "id": inc.id, 
        "title": inc.title, 
        "description": inc.description, 
        "status": inc.status,
        "tenant_id": inc.tenant_id,
        "property_id": inc.property_id,
        "severity": inc.severity,
        "specialty": inc.specialty
        } for inc in incidences]
    return jsonify(incidences_list)

@app.route('/incidences/<int:id>', methods=['GET'])
def get_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:
        return jsonify({"message": "Incidencia no encontrada"}), 404

    return jsonify({
        "id": incidence.id,
        "title": incidence.title,
        "description": incidence.description,
        "status": incidence.status,
        "tenant_id": incidence.tenant_id,
        "property_id": incidence.property_id,
        "severity": incidence.severity,
        "specialty": incidence.specialty
    }), 200


@app.route('/incidences/<int:id>', methods=['PUT'])
def update_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:

        return jsonify({"message": "Incidencia no encontrada"}), 404
    
    data = request.get_json()

    if 'status' in data:
        incidence.status = data['status']
    if 'severity' in data:
        incidence.severity = data['severity']
    if 'specialty' in data:
        incidence.specialty = data['specialty']

    db.session.commit()
    return jsonify({"message": "Incidencia actualizada"}), 200
    
    
    
@app.route('/incidences/<int:id>', methods=['DELETE'])
def delete_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:

        return jsonify({"message": "Incidencia no encontrada"}), 404

    db.session.delete(incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia eliminada"}, 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)