import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async ({ email, password, rol }) => {
    await apiFetch("/api/auth/login", { method: "POST", body: { email, password, rol } });
    await refresh(); // ahora la cookie está puesta
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
