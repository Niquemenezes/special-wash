import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;               // o un spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
