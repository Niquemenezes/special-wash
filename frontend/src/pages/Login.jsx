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
      nav("/panel", { replace:true });
    } catch (e) {
      setErr(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 16 }}>Iniciar sesión</h2>
      {err && <div style={{ color: "crimson", marginBottom: 12 }}>{err}</div>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="form-control" required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="form-control" required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Rol</label>
          <select value={rol} onChange={e=>setRol(e.target.value)} className="form-control">
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <button disabled={loading} className="btn btn-primary" type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
