import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.app import app
from api.models import db, User

with app.app_context():
    u = User.query.filter_by(email='cliente@fixflow.com').first()
    if u:
        u.phone_prefix = '+34'
        u.phone_number = '697338607'
        db.session.commit()
        print('Client phone updated to +34 697338607!')
    else:
        print('Client not found')
