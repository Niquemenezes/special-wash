import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export default function Navbar(){
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const logout = () => { actions.logout(); navigate("/login", { replace:true }); };

  return (
    <nav className="nav">
      <Link to="/" className="brand">SpecialWash</Link>
      <div style={{display:"flex",gap:12}}>
        <Link to="/">Inicio</Link>
        {store.rol === "administrador" && <Link to="/admin">Panel Admin</Link>}
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:12}}>
        {!store.token ? <Link to="/login">Login</Link>
        : <button className="btn" onClick={logout}>Cerrar sesión</button>}
      </div>
    </nav>
  );
}
