#!/usr/bin/env bash
# exit on error
set -o errexit

# Build frontend
cd frontend
npm install
npm run build

# Install backend dependencies and migrate
cd ../backend
pipenv install
pipenv run upgrade
