# backend/app.py
from flask import Flask, jsonify
import os, re
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .db import db
from .config import get_config
from .routes import api_bp
from .admin_panel import setup_admin

def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())

    # ========= CORS (con credenciales) =========
    # Si defines FRONTEND_ORIGIN con un origen exacto, se usa tal cual.
    # Si no, permitimos subdominios de Codespaces/Render y localhost.
    frontend_origin_env = os.getenv("FRONTEND_ORIGIN", "").strip()
    origins = []

    if frontend_origin_env:
        # Ejemplo: https://mi-front.onrender.com
        origins.append(frontend_origin_env)
    else:
        # Acepta cualquier subdominio *.app.github.dev (Codespaces)
        origins.append(re.compile(r"https://.*\.app\.github\.dev$"))
        # Acepta Render (ajusta dominio si ya lo tienes)
        origins.append(re.compile(r"https://.*\.onrender\.com$"))
        # Desarrollo local
        origins.append("http://localhost:3000")
        origins.append("http://127.0.0.1:3000")

    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        supports_credentials=True   # Con cookies/sesiones
    )

    # ========= JWT en COOKIES (cross-site OK) =========
    app.config.setdefault("JWT_TOKEN_LOCATION", ["cookies"])
    app.config.setdefault("JWT_COOKIE_SECURE", True)       # HTTPS
    app.config.setdefault("JWT_COOKIE_SAMESITE", "None")   # cross-site
    app.config.setdefault("JWT_COOKIE_CSRF_PROTECT", False)  # dev simple
    app.config.setdefault("SESSION_COOKIE_SECURE", True)
    app.config.setdefault("SESSION_COOKIE_SAMESITE", "None")

    # ========= Extensiones =========
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)

    # ========= Rutas básicas =========
    @app.get("/")
    def index():
        return jsonify(ok=True, msg="SpecialWash backend vivo. Usa /health y /api/*"), 200

    @app.get("/health")
    def health():
        return jsonify(ok=True), 200

    # ========= API / Admin =========
    app.register_blueprint(api_bp, url_prefix="/api")
    setup_admin(app)
    # app.register_blueprint(admin_bp, url_prefix="/admin")  # si lo necesitas

    return app

# Para gunicorn o `flask run` con fábrica: FLASK_APP=backend.app:create_app
app = create_app()
