import os
from flask import request, Response
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
# arriba del todo ya tienes:
# from flask_admin.contrib.sqla import ModelView
# añade si no lo tuvieras:
from sqlalchemy import func

from wtforms import ValidationError
from .db import db
from .models import (
    Usuario, Producto, Proveedor,
    RegistroEntradaProducto, RegistroSalidaProducto, Maquinaria
)

# -------- helpers --------
def _check_basic_auth(username, password):
    return (
        username == os.getenv("ADMIN_USER", "admin")
        and password == os.getenv("ADMIN_PASS", "changeme")
    )

def _existing_fields(model, names):
    return [n for n in names if hasattr(model, n)]

def _filter_labels(model, labels: dict):
    return {k: v for k, v in labels.items() if hasattr(model, k)}

# -------- vistas protegidas --------
class ProtectedIndex(AdminIndexView):
    def is_accessible(self):
        auth = request.authorization
        return bool(auth and _check_basic_auth(auth.username, auth.password))

    def inaccessible_callback(self, name, **kwargs):
        return Response("Acceso restringido.\n", 401,
                        {"WWW-Authenticate": 'Basic realm=\"SpecialWash Admin\"'})

    @expose("/")
    def index(self):
        if not self.is_accessible():
            return self.inaccessible_callback("index")
        return super().index()

class SecureModelView(ModelView):
    can_view_details = True
    create_modal = True
    edit_modal = True

    def is_accessible(self):
        auth = request.authorization
        return bool(auth and _check_basic_auth(auth.username, auth.password))

    def inaccessible_callback(self, name, **kwargs):
        return Response("Acceso restringido.\n", 401,
                        {"WWW-Authenticate": 'Basic realm=\"SpecialWash Admin\"'})

# -------- vistas por modelo --------
class UsuarioAdminView(SecureModelView):
    def on_model_change(self, form, model, is_created):
        if hasattr(model, "email") and model.email:
            email = (model.email or "").strip().lower()
            q = Usuario.query.filter_by(email=email)
            if getattr(model, "id", None):
                q = q.filter(Usuario.id != model.id)
            if q.first():
                raise ValidationError("El email ya está registrado.")
            model.email = email
        return super().on_model_change(form, model, is_created)

class ProductoAdminView(SecureModelView):
    pass

class ProveedorAdminView(SecureModelView):
    pass

class EntradaAdminView(SecureModelView):
    pass

class SalidaAdminView(SecureModelView):
    pass

class MaquinariaAdminView(SecureModelView):
    pass

def setup_admin(app):
    app.config.setdefault("FLASK_ADMIN_SWATCH", "cerulean")
    admin = Admin(
        app,
        name="SpecialWash Admin",
        template_mode="bootstrap4",
        index_view=ProtectedIndex(url="/admin", endpoint="admin_panel"),
        endpoint="admin_panel",  # <-- nombre de blueprint
        url="/admin"             # <-- prefijo de URL
    )

    # Usuario
    v_user = UsuarioAdminView(Usuario, db.session, name="Usuarios")
    v_user.column_searchable_list = _existing_fields(Usuario, ["nombre", "email", "rol"])
    v_user.column_filters = _existing_fields(Usuario, ["rol", "email"])
    v_user.column_labels = _filter_labels(Usuario, dict(nombre="Nombre", email="Email", rol="Rol"))
    admin.add_view(v_user)

    # Producto
    v_prod = ProductoAdminView(Producto, db.session, name="Productos")
    v_prod.column_searchable_list = _existing_fields(Producto, ["nombre", "categoria"])
    v_prod.column_filters = _existing_fields(Producto, ["categoria", "stock_minimo", "stock_actual"])
    v_prod.column_labels = _filter_labels(Producto, dict(
        nombre="Nombre", categoria="Categoría", stock_minimo="Stock mín.", stock_actual="Stock"
    ))
    admin.add_view(v_prod)

    # Proveedor (dinámico)
    v_prov = ProveedorAdminView(Proveedor, db.session, name="Proveedores")
    v_prov.column_searchable_list = _existing_fields(Proveedor, ["nombre", "email", "telefono", "contacto", "persona_contacto"])
    v_prov.column_filters = _existing_fields(Proveedor, ["email", "telefono", "contacto", "persona_contacto"])
    v_prov.column_labels = _filter_labels(Proveedor, dict(
        nombre="Nombre", email="Email", telefono="Teléfono", contacto="Contacto", persona_contacto="Contacto"
    ))
    admin.add_view(v_prov)

    # Entradas (evita campos inexistentes)
    v_ent = EntradaAdminView(RegistroEntradaProducto, db.session, name="Entradas")
    v_ent.column_searchable_list = _existing_fields(RegistroEntradaProducto, ["numero_albaran", "observaciones"])
    v_ent.column_filters = _existing_fields(RegistroEntradaProducto, ["fecha_entrada", "producto", "proveedor", "producto_id", "proveedor_id"])
    v_ent.column_labels = _filter_labels(RegistroEntradaProducto, dict(
        fecha_entrada="Fecha",
        numero_albaran="Nº Factura/Albarán",
        precio_sin_iva="€ sin IVA",
        porcentaje_iva="% IVA",
        descuento="Descuento",
        precio_con_iva="€ con IVA",
        producto="Producto",
        proveedor="Proveedor",
        observaciones="Observaciones",
        cantidad="Cantidad",
    ))
    admin.add_view(v_ent)

    # Salidas
    v_sal = SalidaAdminView(RegistroSalidaProducto, db.session, name="Salidas")
    v_sal.column_searchable_list = _existing_fields(RegistroSalidaProducto, ["cantidad"])
    v_sal.column_filters = _existing_fields(RegistroSalidaProducto, ["fecha_salida", "producto", "producto_id", "usuario", "usuario_id"])
    v_sal.column_labels = _filter_labels(RegistroSalidaProducto, dict(
        fecha_salida="Fecha", cantidad="Cantidad", producto="Producto", usuario="Usuario"
    ))
    admin.add_view(v_sal)

    # Maquinaria
    v_maq = MaquinariaAdminView(Maquinaria, db.session, name="Maquinaria")
    v_maq.column_searchable_list = _existing_fields(Maquinaria, ["nombre", "marca", "modelo", "numero_serie", "serie"])
    v_maq.column_filters = _existing_fields(Maquinaria, ["estado", "fecha_compra", "ultima_revision"])
    v_maq.column_labels = _filter_labels(Maquinaria, dict(
        nombre="Nombre", marca="Marca", modelo="Modelo", numero_serie="Nº Serie",
        serie="Serie", estado="Estado", fecha_compra="Fecha compra", ultima_revision="Últ. revisión",
        observaciones="Observaciones"
    ))
    admin.add_view(v_maq)

    return admin
