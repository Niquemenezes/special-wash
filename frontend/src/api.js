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

export const apiFetch = jsonFetch;

export async function loginAdmin(creds) {
  if (!creds?.email || !creds?.password) throw new Error("Faltan credenciales");
  const email = String(creds.email).toLowerCase();
  const password = String(creds.password);
  const rol = (creds.rol || "administrador").toLowerCase();
  // Ajusta /api/auth/login -> /api/login si tu backend usa otra ruta
  return jsonFetch("/api/auth/login", { method: "POST", body: { email, password, rol } });
}
export async function logoutApi() { return jsonFetch("/api/auth/logout", { method: "POST" }); }
export async function authMe() { return jsonFetch("/api/auth/me"); }
