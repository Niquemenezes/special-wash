from flask import Flask, jsonify
import os
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .db import db
from .config import get_config
from .routes import api_bp
from .admin_panel import setup_admin
# from .admin import admin_bp  # ⬅️ NUEVO

def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config()

    # --- JWT cookies para cross-site (Codespaces/localhost) ---
    app.config.setdefault("JWT_TOKEN_LOCATION", ["cookies"])
    app.config.setdefault("JWT_COOKIE_SECURE", True)        # https
    app.config.setdefault("JWT_COOKIE_SAMESITE", "None")    # cross-site
    app.config.setdefault("JWT_COOKIE_CSRF_PROTECT", False) # dev simple
    app.config.setdefault("SESSION_COOKIE_SECURE", True)
    app.config.setdefault("SESSION_COOKIE_SAMESITE", "None")

    # --- CORS con credenciales (permite cualquier subdominio app.github.dev) ---
    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv("FRONTEND_ORIGIN", r"https://.*\.app\.github\.dev$"),
            "supports_credentials": True
        }
    })
)

    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)

    @app.get("/")
    def index():
        return jsonify(ok=True, msg="SpecialWash backend vivo. Usa /health y /api/*"), 200

    @app.get("/health")
    def health():
        return jsonify(ok=True), 200

    app.register_blueprint(api_bp, url_prefix="/api")
    setup_admin(app)
#     app.register_blueprint(admin_bp, url_prefix="/admin")  # <- aquí
    return app

app = create_app()

