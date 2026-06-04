import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, User, Property, Asset, Incidence

with app.app_context():
    print("Iniciando preparacion de Base de Datos para la presentacion...")

    def create_user(email, password, role, prefix=None, phone=None):
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, role=role, phone_prefix=prefix, phone_number=phone)
            user.set_password(password)
            db.session.add(user)
            print(f"[OK] Creado usuario: {email} (Rol: {role})")
        else:
            print(f"[INFO] El usuario {email} ya existe. Saltando...")
        return user

    print("\n--- 1. CREANDO USUARIOS ---")
    admin = create_user("admin@fixflow.com", "admin123", "admin")
    tecnico = create_user("tecnico@fixflow.com", "tecnico123", "tecnico")
    cliente = create_user("cliente@fixflow.com", "cliente123", "inquilino", "+34", "600123456")

    print("\n--- 2. CREANDO INMUEBLES Y ACTIVOS ---")
    props_data = [
        ("Torre Empresarial Norte", ["Ascensor Principal", "Sistema HVAC", "Generador Electrico"]),
        ("Residencial Los Pinos", ["Puerta del Garaje", "Bomba de Agua Piscina"]),
        ("Edificio Gran Via 42", ["Caldera Central", "Ascensor Servicio"])
    ]

    for address, asset_names in props_data:
        prop = Property.query.filter_by(address=address).first()
        if not prop:
            prop = Property(address=address)
            db.session.add(prop)
            db.session.commit() 
            print(f"[OK] Inmueble creado: {address}")
            
            for asset_name in asset_names:
                asset = Asset(name=asset_name, property_id=prop.id)
                db.session.add(asset)
                print(f"   -> Activo anadido: {asset_name}")
        else:
            print(f"[INFO] El inmueble '{address}' ya existe. Saltando...")

    db.session.commit()
    print("\n[OK] Base de datos preparada con exito para la presentacion!")
