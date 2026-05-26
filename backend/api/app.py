from sqlalchemy.sql import roles
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from api.models import db, User, Property, Incidence
from api.commands import setup_commands
from api.commands import setup_commands
from api.admin import setup_admin
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import decode_token
from werkzeug.security import generate_password_hash
import secrets 
reset_token = secrets.token_urlsafe(32)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///triage.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)
setup_commands(app)
setup_admin(app)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key-change-it")
jwt = JWTManager(app)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user or (user.password != password and not user.check_password(password)):
        return jsonify({"message": "Credenciales inválidas"}), 401

    if not user.is_active:
        return jsonify({"message": "Usuario inactivo"}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "role": user.role,
        "email": user.email,
        "user_id": user.id
    }), 200

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email requerido"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    reset_token = create_access_token(
    identity=str(user.id), 
    expires_delta=timedelta(minutes=15))    

    return jsonify({
        "message": "Token de recuperación generado con éxito",
        "reset_token": reset_token
    }), 200



@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"message": "Token y nueva contraseña requeridos"}), 400

    try:
        decoded_token = decode_token(token)
        user_id = decoded_token.get("sub")
    except Exception as e:
        return jsonify({"message": "Token inválido o expirado"}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Contraseña restablecida con éxito"}), 200





@app.route('/incidences', methods=['POST'])
def create_incidence():
    data = request.get_json()
    new_incidence = Incidence(
        title=data['title'], 
        description=data['description'],
        tenant_id=data['tenant_id'],
        property_id=data['property_id'],
        technician_id=data.get('technician_id')
    )
    db.session.add(new_incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia creada"}), 201

@app.route('/incidences', methods=['GET'])
def get_incidences():
    
    tech_id = request.args.get('technician_id')
    if tech_id:
        incidences = Incidence.query.filter_by(technician_id=tech_id).all()
    else:
        incidences = Incidence.query.all()

    incidences_list = [{
        "id": inc.id, 
        "title": inc.title, 
        "description": inc.description, 
        "status": inc.status,
        "tenant_id": inc.tenant_id,
        "property_id": inc.property_id,
        "severity": inc.severity,
        "specialty": inc.specialty,
        "technician_id": inc.technician_id
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
        "specialty": incidence.specialty,
        "technician_id": incidence.technician_id
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

    if 'technician_id' in data:
        incidence.technician_id = data['technician_id']

    db.session.commit()
    return jsonify({"message": "Incidencia actualizada"}), 200
    
    
    
@app.route('/incidences/<int:id>', methods=['DELETE'])
def delete_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:

        return jsonify({"message": "Incidencia no encontrada"}), 404

    db.session.delete(incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia eliminada"}), 200


@app.route('/technicians', methods=['GET'])
def get_technicians():
    technicians = User.query.filter_by(role='tecnico').all()
    technicians_list = [{
        "id": tech.id,
        "email": tech.email,
        "role": tech.role,
        "is_active": tech.is_active
    } for tech in technicians]
    return jsonify(technicians_list), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)