import os
import sys
import string
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, Property, User

def generate_pin():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

with app.app_context():
    properties = Property.query.all()
    for prop in properties:
        if not prop.pin_code:
            prop.pin_code = generate_pin()
            print(f"Asignado PIN {prop.pin_code} al inmueble {prop.id}")
            
    db.session.commit()
    
    client = User.query.filter_by(email="cliente@fixflow.com").first()
    if client and properties:
        client.property_id = properties[0].id
        db.session.commit()
        print(f"Cliente asignado a la propiedad 1")
    
    print("Migracion de PINs completada")
