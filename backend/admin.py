# backend/admin.py
from flask import Blueprint, render_template, request, Response
import os
from .db import db
from .models import (
    Producto, Proveedor, Usuario, Maquinaria,
    RegistroEntradaProducto, RegistroSalidaProducto
)

admin_bp = Blueprint("admin", __name__, template_folder="templates/admin")

def _check_basic_auth(username, password):
    return (
        username == os.getenv("ADMIN_USER", "admin")
        and password == os.getenv("ADMIN_PASS", "changeme")
    )

def _auth_required(fn):
    def wrapper(*args, **kwargs):
        auth = request.authorization
        if not auth or not _check_basic_auth(auth.username, auth.password):
            return Response(
                "Acceso restringido.\n", 401,
                {"WWW-Authenticate": 'Basic realm="SpecialWash Admin"'}
            )
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

def _count(model):
    try:
        return db.session.query(model).count()
    except Exception:
        return 0

@admin_bp.route("/")
@_auth_required
def dashboard():
    stats = {
        "productos": _count(Producto),
        "proveedores": _count(Proveedor),
        "maquinaria": _count(Maquinaria),
        "usuarios": _count(Usuario),
        "entradas": _count(RegistroEntradaProducto),
        "salidas": _count(RegistroSalidaProducto),
    }
    return render_template("dashboard.html", stats=stats)

@admin_bp.route("/productos")
@_auth_required
def productos():
    items = db.session.query(Producto).order_by(Producto.id.desc()).limit(500).all()
    return render_template("productos.html", productos=items)

@admin_bp.route("/entradas")
@_auth_required
def entradas():
    items = db.session.query(RegistroEntradaProducto)\
        .order_by(RegistroEntradaProducto.id.desc()).limit(500).all()
    return render_template("entradas.html", entradas=items)

@admin_bp.route("/salidas")
@_auth_required
def salidas():
    items = db.session.query(RegistroSalidaProducto)\
        .order_by(RegistroSalidaProducto.id.desc()).limit(500).all()
    return render_template("salidas.html", salidas=items)

@admin_bp.route("/proveedores")
@_auth_required
def proveedores():
    items = db.session.query(Proveedor).order_by(Proveedor.id.desc()).limit(500).all()
    return render_template("proveedores.html", proveedores=items)

@admin_bp.route("/maquinaria")
@_auth_required
def maquinaria():
    items = db.session.query(Maquinaria).order_by(Maquinaria.id.desc()).limit(500).all()
    return render_template("maquinaria.html", maquinas=items)

@admin_bp.route("/usuarios")
@_auth_required
def usuarios():
    items = db.session.query(Usuario).order_by(Usuario.id.desc()).limit(500).all()
    return render_template("usuarios.html", usuarios=items)
