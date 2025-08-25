from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .db import db
from .config import get_config
from .routes import api_bp
from .admin import admin_bp  # ⬅️ NUEVO

def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config())
    CORS(app, resources={r"/api/*": {"origins": "*"}})
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
    app.register_blueprint(admin_bp, url_prefix="/admin")  # <- aquí
    return app

app = create_app()

