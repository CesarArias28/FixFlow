from api.admin import IncidenceAdmin
from flask_sqlalchemy import query
from sqlalchemy.sql import roles
import os
import io
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from api.models import db, User, Property, Incidence, Asset
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from api.commands import setup_commands
from api.commands import setup_commands
from api.admin import setup_admin
from datetime import timedelta
from api.services.twilio_service import send_whatsapp_notification
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from werkzeug.security import generate_password_hash
import secrets
from datetime import datetime

reset_token = secrets.token_urlsafe(32)

static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'frontend', 'dist')
app = Flask(__name__, static_folder=static_file_dir, static_url_path='')
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
        "user_id": user.id,
        "property_id": user.property_id
    }), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    pin_code = data.get("pin_code")
    phone_prefix = data.get("phone_prefix", "")
    phone_number = data.get("phone_number", "")

    if not email or not password or not pin_code:
        return jsonify({"message": "Email, contraseña y PIN de Inmueble son obligatorios"}), 400

    prop = Property.query.filter_by(pin_code=pin_code).first()
    if not prop:
        return jsonify({"message": "El PIN de Inmueble es inválido"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Este correo ya está registrado"}), 400

    new_user = User(
        email=email,
        role="inquilino",
        phone_prefix=phone_prefix,
        phone_number=phone_number,
        property_id=prop.id
    )
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registro completado con éxito"}), 201


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
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    print("\n" + "="*50)
    print(f"SIMULANDO ENVÍO DE EMAIL A: {email}")
    print(f"Enlace de recuperación:\n{reset_link}")
    print("="*50 + "\n")


    return jsonify({
        "message": "Enlace de recuperación generado con éxito",
        "reset_token": reset_token,
        "reset_link": reset_link
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
@jwt_required()
def create_incidence():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    tenant_id = data.get('tenant_id') or current_user_id
    tenant = User.query.get(tenant_id)
    property_id = data.get('property_id') or (tenant.property_id if tenant else None)

    asset_id = data.get('asset_id')
    custom_asset_name = data.get('custom_asset_name')

    if custom_asset_name and not asset_id:
        from .models import Asset
        new_asset = Asset(name=custom_asset_name, property_id=property_id)
        db.session.add(new_asset)
        db.session.flush()
        asset_id = new_asset.id

    new_incidence = Incidence(
        title=data['title'], 
        description=data['description'],
        tenant_id=tenant_id,
        property_id=property_id,
        technician_id=data.get('technician_id'),
        asset_id=asset_id
    )
    db.session.add(new_incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia creada"}), 201

@app.route('/incidences', methods=['GET'])
@jwt_required()
def get_incidences():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    tech_id = request.args.get('technician_id')
    
    if user.role == 'inquilino':
        incidences = Incidence.query.filter_by(tenant_id=current_user_id).all()
    elif tech_id:
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
        "property_address": inc.property.address if inc.property else f"ID {inc.property_id}",
        "severity": inc.severity,
        "specialty": inc.specialty,
        "technician_id": inc.technician_id,
        "asset_id" : inc.asset_id,
        "asset_name": inc.asset.name if inc.asset else None
        } for inc in incidences]
    return jsonify(incidences_list)

@app.route('/incidences/<int:id>', methods=['GET'])
@jwt_required()
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
        "technician_id": incidence.technician_id,
        "asset_id": incidence.asset_id,
        "asset_name": incidence.asset.name if incidence.asset else None
    }), 200

@app.route('/incidences/<int:id>/pdf', methods=['GET'])
@jwt_required()
def download_incidence_pdf(id):
    incidence = Incidence.query.get(id)
    if not incidence:
        return jsonify({"message": "Incidencia no encontrada"}), 404


    tenant = User.query.get(incidence.tenant_id)
    prop = Property.query.get(incidence.property_id)
    tech = User.query.get(incidence.technician_id) if incidence.technician_id else None

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=40)
    
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle(
        'PDFTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0d6efd'),
        spaceAfter=15
    )
    subtitle_style = ParagraphStyle(
        'PDFSubTitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#6c757d'),
        spaceAfter=20
    )
    label_style = ParagraphStyle(
        'PDFLabel',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#212529')
    )
    value_style = ParagraphStyle(
        'PDFValue',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#495057')
    )

    story.append(Paragraph("FixFlow - Reporte de Incidencia", title_style))
    story.append(Paragraph(f"Detalle formal de la avería registrada #{incidence.id}", subtitle_style))
    story.append(Spacer(1, 10))

    current_date = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    data = [
        [Paragraph("Fecha de Generación:", label_style), Paragraph(current_date, value_style)],
        [Paragraph("Título de la Avería:", label_style), Paragraph(incidence.title, value_style)],
        [Paragraph("Descripción:", label_style), Paragraph(incidence.description, value_style)],
        [Paragraph("Estado Actual:", label_style), Paragraph(incidence.status, value_style)],
        [Paragraph("Severidad:", label_style), Paragraph(incidence.severity or "No asignada", value_style)],
        [Paragraph("Especialidad requerida:", label_style), Paragraph(incidence.specialty or "No asignada", value_style)],
        [Paragraph("Dirección del Inmueble:", label_style), Paragraph(prop.address if prop else f"ID de propiedad: {incidence.property_id}", value_style)],
        [Paragraph("Correo del Inquilino:", label_style), Paragraph(tenant.email if tenant else f"ID de inquilino: {incidence.tenant_id}", value_style)],
        [Paragraph("Técnico Responsable:", label_style), Paragraph(tech.email if tech else "Sin técnico asignado", value_style)],
        [Paragraph("Equipo / Activo afectado:", label_style), Paragraph(incidence.asset.name if incidence.asset else "No aplica", value_style)],
    ]
    
    if incidence.resolved_at:
        resolved_date_str = incidence.resolved_at.strftime("%d/%m/%Y %H:%M:%S")
        data.insert(1, [Paragraph("Fecha de Resolución:", label_style), Paragraph(resolved_date_str, value_style)])

    table = Table(data, colWidths=[140, 360])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8f9fa')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e9ecef')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e9ecef')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))

    story.append(table)
    
    doc.build(story)
    
    buffer.seek(0)  
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"reporte_incidencia_{id}.pdf",
        mimetype="application/pdf"
    )





@app.route('/incidences/<int:id>', methods=['PUT'])
@jwt_required()
def update_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:

        return jsonify({"message": "Incidencia no encontrada"}), 404
    
    data = request.get_json()
    
    old_status = incidence.status

    if 'status' in data:
        incidence.status = data['status']
        if data['status'] == 'Resuelto':
            incidence.resolved_at = datetime.now()
        else:
            # Si se vuelve a poner "En progreso", borramos la fecha de resolución
            incidence.resolved_at = None

    if 'severity' in data:
        incidence.severity = data['severity']
    if 'specialty' in data:
        incidence.specialty = data['specialty']

    if 'technician_id' in data:
        incidence.technician_id = data['technician_id']

    if 'asset_id' in data:
        incidence.asset_id = data ['asset_id']


    db.session.commit()

    if old_status != incidence.status:
        tenant = User.query.get(incidence.tenant_id)
        if tenant and tenant.phone_number:
            prefix = tenant.phone_prefix or ""
            full_number = f"{prefix}{tenant.phone_number}"
            send_whatsapp_notification(full_number, incidence.title, incidence.status)

    return jsonify({"message": "Incidencia actualizada"}), 200
    
    
    
@app.route('/incidences/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_incidence(id):
    incidence = Incidence.query.get(id)
    if not incidence:

        return jsonify({"message": "Incidencia no encontrada"}), 404

    db.session.delete(incidence)
    db.session.commit()
    return jsonify({"message": "Incidencia eliminada"}), 200


@app.route('/tenants', methods=['GET'])
@jwt_required()
def get_tenants():
    tenants = User.query.filter_by(role='inquilino').all()
    tenants_list = [{"id": t.id, "email": t.email} for t in tenants]
    return jsonify(tenants_list), 200

@app.route('/properties', methods=['GET'])
@jwt_required()
def get_properties():
    properties = Property.query.all()
    props_list = [{"id": p.id, "address": p.address} for p in properties]
    return jsonify(props_list), 200

@app.route('/technicians', methods=['GET'])
@jwt_required()
def get_technicians():
    technicians = User.query.filter_by(role='tecnico').all()
    technicians_list = [{
        "id": tech.id,
        "email": tech.email,
        "role": tech.role,
        "is_active": tech.is_active
    } for tech in technicians]
    return jsonify(technicians_list), 200

@app.route('/assets', methods=['GET'])
@jwt_required()
def get_assets():
    property_id = request.args.get('property_id') 
    if property_id:
        assets = Asset.query.filter_by(property_id=property_id).all()
    else:
        assets = Asset.query.all()
    assets_list = [{
        "id": asset.id,
        "name": asset.name,
        "property_id": asset.property_id
    } for asset in assets]
    return jsonify(assets_list), 200


@app.route('/assets', methods=['POST'])
@jwt_required()
def create_asset():
    data = request.get_json()
    if not data or 'name' not in data or 'property_id' not in data:
        return jsonify({"message": "Campos 'name' y 'property_id' requeridos"}), 400
    
    new_asset = Asset(
        name=data['name'],
        property_id=data['property_id']
    )
    db.session.add(new_asset)
    db.session.commit()
    return jsonify({"message": "Activo creado con éxito", "id": new_asset.id}), 201


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)