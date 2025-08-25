import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("administrador");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin({ email, password, rol });
      await onLoggedIn?.();
      const next = loc.state?.from?.pathname || "/";
      nav(next, { replace: true });
    } catch (e) {
      setError("Credenciales inválidas o error de red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 440 }}>
      <h3 className="mt-5 mb-3">Iniciar sesión</h3>
      {error && <div className="alert alert-warning">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="form-label">Rol</label>
          <select className="form-select" value={rol} onChange={e=>setRol(e.target.value)}>
            <option>administrador</option>
            <option>empleado</option>
            <option>pintor</option>
            <option>limpiador</option>
            <option>mantenimiento</option>
            <option>almacen</option>
          </select>
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
