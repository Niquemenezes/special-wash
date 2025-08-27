// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return null; // puedes poner un spinner aquí
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
