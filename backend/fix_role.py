import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, User

with app.app_context():
    u = User.query.filter_by(email='admin@fixflow.com').first()
    if u:
        u.role = 'administrador'
        db.session.commit()
        print('Role for admin updated to administrador!')
    else:
        print('Admin user not found.')
