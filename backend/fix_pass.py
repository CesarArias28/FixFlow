import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, User

with app.app_context():
    u = User.query.filter_by(email='tecnico@fixflow.com').first()
    if u:
        u.set_password('tecnico123')
        db.session.commit()
        print('Password for tecnico fixed to tecnico123')
    else:
        print('User not found.')
