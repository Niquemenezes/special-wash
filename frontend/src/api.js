const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const getToken = () => sessionStorage.getItem("token") || "";

export async function apiFetch(path, { method="GET", body=null, auth=true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export const loginAdmin = () =>
  apiFetch("/api/auth/seed-admin", { method:"POST", auth:false })
    .catch(()=>{})
    .then(()=> apiFetch("/api/auth/login", {
      method:"POST", auth:false,
      body:{ email:"admin@specialwash.local", password:"admin12345" }
    }));

export const getProductos = () => apiFetch("/api/productos");
export const getProveedores = () => apiFetch("/api/proveedores");
