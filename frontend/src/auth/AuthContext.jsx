import { createContext, useContext, useEffect, useState } from "react";
import { authMe, logoutApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await authMe();
        setUser(me);
      } catch { setUser(null); }
      finally { setReady(true); }
    })();
  }, []);

  async function logout() {
    try { await logoutApi(); } catch {}
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, ready, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
