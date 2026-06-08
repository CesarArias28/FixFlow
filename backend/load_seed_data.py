import os
import sys
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, User, Property, Asset, Incidence

def load_data():
    with app.app_context():
        with open('seed_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("Cargando Propiedades...")
        for p_data in data.get('property', []):
            if not Property.query.filter_by(id=p_data['id']).first():
                prop = Property(
                    address=p_data['address'],
                    pin_code=p_data['pin_code']
                )
                prop.id = p_data['id']
                db.session.add(prop)
        db.session.commit()
        
        print("Cargando Usuarios...")
        for u_data in data.get('user', []):
            if not User.query.filter_by(id=u_data['id']).first() and not User.query.filter_by(email=u_data['email']).first():
                user = User(
                    email=u_data['email'],
                    role=u_data['role'],
                    phone_prefix=u_data['phone_prefix'],
                    phone_number=u_data['phone_number'],
                    property_id=u_data['property_id']
                )
                user.id = u_data['id']
                user.password = u_data['password'] # It's already hashed!
                db.session.add(user)
        db.session.commit()
        
        print("Cargando Activos...")
        for a_data in data.get('asset', []):
            if not Asset.query.filter_by(id=a_data['id']).first():
                asset = Asset(
                    name=a_data['name'],
                    property_id=a_data['property_id']
                )
                asset.id = a_data['id']
                db.session.add(asset)
        db.session.commit()
        
        print("Cargando Incidencias...")
        from datetime import datetime
        for i_data in data.get('incidence', []):
            if not Incidence.query.filter_by(id=i_data['id']).first():
                resolved_at = None
                if i_data['resolved_at']:
                    resolved_at = datetime.fromisoformat(i_data['resolved_at'])
                    
                incidence = Incidence(
                    title=i_data['title'],
                    description=i_data['description'],
                    status=i_data['status'],
                    severity=i_data['severity'],
                    specialty=i_data['specialty'],
                    tenant_id=i_data['tenant_id'],
                    property_id=i_data['property_id'],
                    technician_id=i_data['technician_id'],
                    asset_id=i_data['asset_id']
                )
                incidence.id = i_data['id']
                incidence.resolved_at = resolved_at
                db.session.add(incidence)
        db.session.commit()
        
        # Actualizar secuencias de PostgreSQL (si se está usando postgres)
        if db.engine.dialect.name == 'postgresql':
            print("Actualizando secuencias de PostgreSQL...")
            from sqlalchemy import text
            db.session.execute(text("SELECT setval('user_id_seq', (SELECT MAX(id) FROM \"user\"));"))
            db.session.execute(text("SELECT setval('property_id_seq', (SELECT MAX(id) FROM property));"))
            db.session.execute(text("SELECT setval('asset_id_seq', (SELECT MAX(id) FROM asset));"))
            db.session.execute(text("SELECT setval('incidence_id_seq', (SELECT MAX(id) FROM incidence));"))
            db.session.commit()
            
        print("¡Datos cargados exitosamente!")

if __name__ == '__main__':
    load_data()
