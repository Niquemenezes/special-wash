// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { authMe, logoutApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Comprobar sesión al cargar (si la cookie JWT existe, el backend devuelve 200)
  useEffect(() => {
    (async () => {
      try {
        const me = await authMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  async function logout() {
    try { await logoutApi(); } catch {}
    setUser(null);
  }

  const value = { user, setUser, ready, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
