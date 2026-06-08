import re

with open('backend/api/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports for SecureModelView
auth_code = """
from flask import request, Response
from werkzeug.exceptions import HTTPException

class AuthException(HTTPException):
    def __init__(self, message):
        super().__init__(message, Response(
            "You could not be authenticated. Please refresh the page.", 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}
        ))

class SecureModelView(ModelView):
    def is_accessible(self):
        auth = request.authorization
        if not auth or not auth.username or not auth.password:
            raise AuthException('Not authenticated.')
        
        user = User.query.filter_by(email=auth.username).first()
        if not user or user.password != auth.password:
            if not user or not user.check_password(auth.password):
                raise AuthException('Not authenticated.')
            
        if user.role != 'admin':
            raise AuthException('Not authorized.')
            
        return True

"""

content = content.replace("from flask_admin.contrib.sqla import ModelView\n", "from flask_admin.contrib.sqla import ModelView\n" + auth_code)

# Replace ModelView with SecureModelView
content = content.replace("class UserAdmin(ModelView):", "class UserAdmin(SecureModelView):")
content = content.replace("class PropertyAdmin(ModelView):", "class PropertyAdmin(SecureModelView):")
content = content.replace("class IncidenceAdmin(ModelView):", "class IncidenceAdmin(SecureModelView):")
content = content.replace("class AssetAdmin(ModelView):", "class AssetAdmin(SecureModelView):")

with open('backend/api/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
