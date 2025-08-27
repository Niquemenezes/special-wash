import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";

export default function Login(){
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("administrador");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); setErr(""); setLoading(true);
    const ok = await actions.loginUnico({ email, password, rol });
    setLoading(false);
    if(ok){
      if(rol.toLowerCase()==="administrador") navigate("/admin",{replace:true});
      else navigate(from,{replace:true});
    } else setErr("Credenciales o rol incorrectos");
  };

  return (
    <section className="card" style={{maxWidth:440, margin:"32px auto"}}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
        <label>Email<input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label>Contraseña<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <label>Rol
          <select className="select" value={rol} onChange={e=>setRol(e.target.value)}>
            <option value="administrador">Administrador</option>
            <option value="empleado">Empleado</option>
            <option value="pintor">Pintor</option>
            <option value="limpiador">Limpiador</option>
            <option value="almacen">Almacén</option>
          </select>
        </label>
        {err && <div style={{color:"#ff4d4f"}}>{err}</div>}
        <button className="btn" type="submit" disabled={loading}>{loading?"Entrando...":"Entrar"}</button>
      </form>
    </section>
  );
}
