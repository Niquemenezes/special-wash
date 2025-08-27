// API base
const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// Headers helper (no forzamos Content-Type si es FormData)
function buildHeaders(extra = {}, body) {
  const headers = { ...extra };
  const token = sessionStorage.getItem("token");
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// Fetch helper
async function jsonFetch(path, { method = "GET", body = null, headers = {} } = {}) {
  const opts = { method, headers: buildHeaders(headers, body) };
  if (body) opts.body = body instanceof FormData ? body : JSON.stringify(body);

  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  return res.json();
}

// ==== Auth ====
export async function apiLogin({ email, password, rol }) {
  return jsonFetch("/api/login", { method: "POST", body: { email, password, rol } });
}

// ==== Productos ====
export async function listProductos(qs = "") {
  const suffix = qs ? `?${qs}` : "";
  return jsonFetch(`/api/productos${suffix}`, { method: "GET" });
}
export async function getProducto(id) {
  return jsonFetch(`/api/productos/${id}`, { method: "GET" });
}
export async function createProducto(payload) {
  return jsonFetch(`/api/productos`, { method: "POST", body: payload });
}
export async function updateProducto(id, payload) {
  return jsonFetch(`/api/productos/${id}`, { method: "PUT", body: payload });
}
export async function deleteProducto(id) {
  return jsonFetch(`/api/productos/${id}`, { method: "DELETE" });
}

// ==== Proveedores ====
export async function listProveedores() {
  return jsonFetch(`/api/proveedores`, { method: "GET" });
}
export async function createProveedor(payload) {
  return jsonFetch(`/api/proveedores`, { method: "POST", body: payload });
}
export async function updateProveedor(id, payload) {
  return jsonFetch(`/api/proveedores/${id}`, { method: "PUT", body: payload });
}
export async function deleteProveedor(id) {
  return jsonFetch(`/api/proveedores/${id}`, { method: "DELETE" });
}

// ==== Entradas / Salidas ====
export async function registrarEntrada(payload) {
  return jsonFetch(`/api/registro-entrada`, { method: "POST", body: payload });
}
export async function resumenEntradas(params = "") {
  const suffix = params ? `?${params}` : "";
  return jsonFetch(`/api/registro-entrada${suffix}`, { method: "GET" });
}
export async function registrarSalida(payload) {
  return jsonFetch(`/api/registro-salida`, { method: "POST", body: payload });
}
export async function historialSalidas(params = "") {
  const suffix = params ? `?${params}` : "";
  return jsonFetch(`/api/salidas${suffix}`, { method: "GET" });
}
