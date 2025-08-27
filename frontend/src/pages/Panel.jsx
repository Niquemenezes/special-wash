import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Panel(){
  const { user, logout } = useAuth();
  const nav = useNavigate();
  async function onLogout(){ await logout(); nav("/login", { replace:true }); }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2>Panel Admin</h2>
        <button className="btn btn-outline-danger" onClick={onLogout}>Cerrar sesión</button>
      </div>
      <hr />
      <p>Bienvenida/o, <b>{user?.email || "usuario"}</b></p>
      {/* Aquí irán tus tarjetas: Productos, Proveedores, Entradas, Salidas, etc. */}
    </div>
  );
}
