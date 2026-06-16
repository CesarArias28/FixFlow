<div align="center">
  <img src="https://raw.githubusercontent.com/CesarArias28/FixFlow/main/fixflow_logo_blanco_verde.svg" alt="FixFlow Logo" width="200" height="200" />
  
  # 🛠️ FixFlow

  **El fin del caos en el alquiler.**  
  *Reparaciones y averías gestionadas tan fácil como pedir un Uber.*

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
</div>

---

## 🚀 ¿Qué es FixFlow?

¿Inquilinos frustrados llamando de madrugada? ¿Correos perdidos? ¿Técnicos que no saben a qué puerta llamar? **No más.**

**FixFlow** es una plataforma integral diseñada para digitalizar y centralizar el mantenimiento de propiedades. Conectamos a inquilinos, administradores de fincas (o inmobiliarias) y técnicos de mantenimiento en un ecosistema centralizado, transparente y en tiempo real.

Devolvemos la paz mental a todos los involucrados en el sector inmobiliario.

---

## ✨ Características Principales

- 🏡 **Para el Inquilino:** Reporte de incidencias en menos de 15 segundos. Sin botones complicados.
- 🏢 **Para el Administrador/Inmobiliaria:** Un dashboard centralizado (React) y un Backoffice potente (Flask-Admin) para asignar y monitorear el estado de cada reparación en vivo.
- 🔧 **Para el Técnico:** Un panel móvil súper accesible para ver exactamente dónde hay que ir, qué hay que arreglar y marcar el trabajo como "Resuelto".
- 🛡️ **Seguridad Nativa:** Sistema de roles jerárquicos (Inquilino, Técnico, Admin) blindado con JWT y Guardianes de Rutas en React.
- 📱 **Notificaciones Integradas:** Integración con la API de Twilio para mantener a todos actualizados.

---

## 💻 Tecnologías Utilizadas

Construido con amor y con un stack moderno enfocado en la escalabilidad y la velocidad:

### Frontend
- **React.js** (Bootstrapped con Vite para máxima velocidad)
- **Tailwind CSS** & **shadcn/ui** (Interfaces limpias, modernas y responsivas)
- **Context API** (Gestión de estado global y manejo de sesión)

### Backend
- **Python & Flask** (Microframework ligero y flexible)
- **SQLAlchemy & Alembic** (ORM de base de datos relacional y migraciones sin dolor)
- **Flask-JWT-Extended** (Autenticación robusta y segura)
- **Flask-Admin** (Panel de administración CRUD nativo)

---

## 🛠️ Instalación y Configuración Local

¿Quieres probar FixFlow en tu propia máquina? ¡Es súper fácil!

### 1. Clona el repositorio
```bash
git clone https://github.com/CesarArias28/FixFlow.git
cd FixFlow
```

### 2. Levanta el Backend (Python/Flask)
Abre una terminal y colócate en la carpeta `backend`:
```bash
cd backend

# Crea tu entorno virtual y actívalo
python -m venv .venv
source .venv/bin/activate  # En Windows usa: .venv\Scripts\activate

# Instala las dependencias
pip install -r requirements.txt

# Inicializa la base de datos (SQLite localmente)
flask db upgrade

# ¡Corre el servidor!
flask run
```
*El backend estará corriendo en `http://localhost:3001`*

### 3. Levanta el Frontend (React/Vite)
Abre otra terminal y colócate en la carpeta `frontend`:
```bash
cd frontend

# Instala los paquetes
npm install

# ¡Inicia el entorno de desarrollo!
npm run dev
```
*El frontend estará corriendo en `http://localhost:5173`*

---

## 🧪 Datos de Prueba (Seed)

Para no empezar con la plataforma vacía, puedes inyectar datos de prueba generados especialmente para la demostración:

- Asegúrate de que el backend esté corriendo.
- Visita en tu navegador: `http://localhost:3001/api/load-seed`
- ¡Bum! Ahora tienes Usuarios, Propiedades e Incidencias precargadas en tu base de datos listos para probar.

**Usuarios Demo:**
- **Inmobiliaria:** `admin@fixflow.com` | Clave: `admin123`
- **Inquilino:** `cliente@fixflow.com` | Clave: `cliente123`
- **Técnico:** `tecnico@fixflow.com` | Clave: `tecnico123`

---

## 🤝 Contribuciones

Las contribuciones hacen a la comunidad open source un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será **muy apreciada**.

1. Haz un Fork del proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Distribuido bajo la licencia MIT. Vea el archivo `LICENSE` para más detalles.

---

<div align="center">
  Hecho con ❤️ por el equipo de FixFlow.
</div>
