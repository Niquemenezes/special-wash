import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, authMe } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function Login(){
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("administrador");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e){
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await loginAdmin({ email, password, rol });
      const me = await authMe();
      setUser(me);
      nav("/panel", { replace: true });
    } catch (e) {
      setErr(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="card card-soft p-4">
            <h3 className="mb-3">Iniciar sesión</h3>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={onSubmit} className="vstack gap-3">
              <div>
                <label className="form-label">Email</label>
                <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Contraseña</label>
                <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Rol</label>
                <select className="form-select" value={rol} onChange={e=>setRol(e.target.value)}>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <button className="btn" disabled={loading} type="submit">
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
          <p className="text-center text-muted mt-3 small">© SpecialWash</p>
        </div>
      </div>
    </div>
  );
}
