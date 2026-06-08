render_build.sh

#!/usr/bin/env bash
# exit on error
set -o errexit
# Build frontend
cd frontend
npm install
npm run build
# Install backend dependencies and migrate
cd ../backend
pip install -r requirements.txt
FLASK_APP=wsgi.py python -m flask db upgrade

