import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import Usuarios from "./pages/Usuarios";
import Maquinaria from "./pages/Maquinaria";
import Entradas from "./pages/Entradas";
import Salidas from "./pages/Salidas";
import { loginAdmin } from "./api";
import Reportes from "./pages/Reportes";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  // Usa useCallback para memoizar la función login
  const login = useCallback(async () => {
    const data = await loginAdmin();
    sessionStorage.setItem("token", data.token);
    setToken(data.token);
  }, []);

  const logout = () => { 
    sessionStorage.removeItem("token"); 
    setToken(""); 
  };

  // useEffect corregido con dependencias adecuadas
  useEffect(() => { 
    if (!token) {
      login().catch(() => {});
    }
  }, [token, login]); // Ahora incluye token y login como dependencias

  return (
    <BrowserRouter>
      <Layout onLogout={logout} isAuthed={!!token}>
        {!token ? (
          <div className="text-center py-5">
            <h3 className="mb-3">Necesitas iniciar sesión</h3>
            <button className="btn btn-primary" onClick={login}>
              <i className="bi bi-person-lock me-2"></i>Entrar como admin
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/maquinaria" element={<Maquinaria />} />
            <Route path="/entradas" element={<Entradas />} />
            <Route path="/salidas" element={<Salidas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  );
}