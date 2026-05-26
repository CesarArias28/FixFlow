import os
from flask_admin import Admin
from .models import db, User, Property, Incidence
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme


class UserAdmin(ModelView):
    form_choices = {
        'role': [
            ('inquilino', 'Inquilino'),
            ('tecnico', 'Técnico'),
            ('administrador', 'Administrador/Inmobiliaria')
        ]
    }
class IncidenceAdmin(ModelView):
    form_choices = {
        'status': [
            ('Pendiente', 'Pendiente'),
            ('En progreso', 'En progreso'),
            ('Resuelto', 'Resuelto')
        ],
        'severity': [
            ('Baja', 'Baja'),
            ('Media', 'Media'),
            ('Alta', 'Alta'),
            ('Crítica', 'Crítica')
        ],
        'specialty': [
            ('Fontanería', 'Fontanería'),
            ('Electricidad', 'Electricidad'),
            ('Cerrajería', 'Cerrajería'),
            ('Albañilería', 'Albañilería'),
            ('Pintura', 'Pintura'),
            ('Otros', 'Otros')
        ]
    }
def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))
    admin.add_view(UserAdmin(User, db.session))
    admin.add_view(ModelView(Property, db.session))
    admin.add_view(IncidenceAdmin(Incidence, db.session))