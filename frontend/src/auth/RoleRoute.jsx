import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleRoute({ allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = (user.rol || user.role || "").toLowerCase();
  const allowed = Array.isArray(allow) ? allow : [allow];
  if (!allowed.map(r => r.toLowerCase()).includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
