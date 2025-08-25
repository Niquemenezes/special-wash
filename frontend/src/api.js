const BASE = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

// JSON fetch con cookies (JWT por cookie)
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

// Alias por compatibilidad con tus páginas
export const apiFetch = jsonFetch;

// Login admin (args opcionales) -> devuelve token "cookie" para tu UI
export async function loginAdmin(creds = {}) {
  const email = (creds.email || "admin@specialwash.local").toLowerCase();
  const password = creds.password || "admin12345";
  const rol = (creds.rol || "administrador").toLowerCase();
  const data = await jsonFetch("/api/auth/login", { method: "POST", body: { email, password, rol } });
  // El backend pone cookie; devolvemos un "token" simbólico para tu state
  return { ...data, token: "cookie" };
}

export async function logoutApi() {
  return jsonFetch("/api/auth/logout", { method: "POST" });
}

export async function authMe() {
  return jsonFetch("/api/auth/me");
}

/* --------- LISTADOS --------- */
export async function getProductos() { return jsonFetch("/api/productos"); }
export async function getProveedores() { return jsonFetch("/api/proveedores"); }
export async function getEntradas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/registro-entrada" + (qs ? `?${qs}` : ""));
}
export async function getSalidas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/registro-salida" + (qs ? `?${qs}` : ""));
}
export async function getMaquinaria() { return jsonFetch("/api/maquinaria"); }

/* --------- MUTACIONES --------- */
export async function createProducto(payload) { return jsonFetch("/api/productos", { method: "POST", body: payload }); }
export async function updateProducto(id, payload) { return jsonFetch(`/api/productos/${id}`, { method: "PUT", body: payload }); }
export async function deleteProducto(id) { return jsonFetch(`/api/productos/${id}`, { method: "DELETE" }); }

export async function createProveedor(payload) { return jsonFetch("/api/proveedores", { method: "POST", body: payload }); }
export async function updateProveedor(id, payload) { return jsonFetch(`/api/proveedores/${id}`, { method: "PUT", body: payload }); }
export async function deleteProveedor(id) { return jsonFetch(`/api/proveedores/${id}`, { method: "DELETE" }); }

export async function createEntrada(payload) { return jsonFetch("/api/registro-entrada", { method: "POST", body: payload }); }
export async function createSalida(payload) { return jsonFetch("/api/registro-salida", { method: "POST", body: payload }); }

export async function createMaquinaria(payload) { return jsonFetch("/api/maquinaria", { method: "POST", body: payload }); }
export async function updateMaquinaria(id, payload) { return jsonFetch(`/api/maquinaria/${id}`, { method: "PUT", body: payload }); }
export async function deleteMaquinaria(id) { return jsonFetch(`/api/maquinaria/${id}`, { method: "DELETE" }); }

/* --------- REPORTES --------- */
export async function reporteGastoProductos(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return jsonFetch("/api/reportes/gasto-productos" + (qs ? `?${qs}` : ""));
}
