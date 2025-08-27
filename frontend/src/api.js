// frontend/src/api.js
const BASE = (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export async function jsonFetch(path, { method = "GET", body, headers = {}, ...rest } = {}) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: isFormData ? headers : { "Content-Type": "application/json", ...headers },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    ...rest,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg = data && typeof data === "object" && data.msg ? data.msg : res.statusText || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// Alias
export const apiFetch = jsonFetch;

// ==== Auth ====
export async function loginAdmin(creds) {
  if (!creds?.email || !creds?.password) throw new Error("Faltan credenciales");
  const email = String(creds.email).toLowerCase();
  const password = String(creds.password);
  const rol = (creds.rol || "administrador").toLowerCase();
  return jsonFetch("/api/auth/login", { method: "POST", body: { email, password, rol } });
}

export async function logoutApi() {
  return jsonFetch("/api/auth/logout", { method: "POST" });
}

export async function authMe() {
  return jsonFetch("/api/auth/me");
}

// ==== Productos ====
export async function getProductos(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/productos" + (qs ? `?${qs}` : ""));
}
export async function createProducto(payload) { return jsonFetch("/api/productos", { method: "POST", body: payload }); }
export async function updateProducto(id, payload) { return jsonFetch(\`/api/productos/\${id}\`, { method: "PUT", body: payload }); }
export async function deleteProducto(id) { return jsonFetch(\`/api/productos/\${id}\`, { method: "DELETE" }); }

// ==== Proveedores ====
export async function getProveedores(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/proveedores" + (qs ? \`?\${qs}\` : ""));
}
export async function createProveedor(payload) { return jsonFetch("/api/proveedores", { method: "POST", body: payload }); }
export async function updateProveedor(id, payload) { return jsonFetch(\`/api/proveedores/\${id}\`, { method: "PUT", body: payload }); }
export async function deleteProveedor(id) { return jsonFetch(\`/api/proveedores/\${id}\`, { method: "DELETE" }); }

// ==== Entradas ====
export async function getEntradas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/registro-entrada" + (qs ? \`?\${qs}\` : ""));
}
export async function createEntrada(payload) { return jsonFetch("/api/registro-entrada", { method: "POST", body: payload }); }

// ==== Salidas ====
export async function getSalidas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/registro-salida" + (qs ? \`?\${qs}\` : ""));
}
export async function createSalida(payload) { return jsonFetch("/api/registro-salida", { method: "POST", body: payload }); }

// ==== Maquinaria ====
export async function getMaquinaria(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/maquinaria" + (qs ? \`?\${qs}\` : ""));
}
export async function createMaquinaria(payload) { return jsonFetch("/api/maquinaria", { method: "POST", body: payload }); }
export async function updateMaquinaria(id, payload) { return jsonFetch(\`/api/maquinaria/\${id}\`, { method: "PUT", body: payload }); }
export async function deleteMaquinaria(id) { return jsonFetch(\`/api/maquinaria/\${id}\`, { method: "DELETE" }); }

// ==== Reportes ====
export async function reporteGastoProductos(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/reportes/gasto-productos" + (qs ? \`?\${qs}\` : ""));
}

// ==== Usuarios (CRUD) ====
export async function getUsuarios(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/usuarios" + (qs ? \`?\${qs}\` : ""));
}
export async function createUsuario(payload) { return jsonFetch("/api/usuarios", { method: "POST", body: payload }); }
export async function updateUsuario(id, payload) { return jsonFetch(\`/api/usuarios/\${id}\`, { method: "PUT", body: payload }); }
export async function deleteUsuario(id) { return jsonFetch(\`/api/usuarios/\${id}\`, { method: "DELETE" }); }
