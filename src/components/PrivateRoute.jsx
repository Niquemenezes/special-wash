import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export default function PrivateRoute({ rolesPermitidos = [], children }){
  const { store } = useContext(Context);
  const location = useLocation();

  const isAuth = !!store.token;
  const rol = store.rol?.toLowerCase();

  if(!isAuth) return <Navigate to="/login" replace state={{ from: location }} />;
  if(rolesPermitidos.length && !rolesPermitidos.includes(rol)) return <Navigate to="/" replace />;
  return children;
}
