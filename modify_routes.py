with open('backend/api/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all routes with /api/
content = content.replace("@app.route('/login", "@app.route('/api/login")
content = content.replace("@app.route('/signup", "@app.route('/api/signup")
content = content.replace("@app.route('/forgot-password", "@app.route('/api/forgot-password")
content = content.replace("@app.route('/reset-password", "@app.route('/api/reset-password")
content = content.replace("@app.route('/incidences", "@app.route('/api/incidences")
content = content.replace("@app.route('/tenants", "@app.route('/api/tenants")
content = content.replace("@app.route('/properties", "@app.route('/api/properties")
content = content.replace("@app.route('/technicians", "@app.route('/api/technicians")
content = content.replace("@app.route('/assets", "@app.route('/api/assets")

with open('backend/api/app.py', 'w', encoding='utf-8') as f:
    f.write(content)
