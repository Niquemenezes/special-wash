import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout/Layout";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/panel" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/panel"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />
      {/* En el futuro: <Route path="/productos" element={<PrivateRoute><Layout><Productos/></Layout></PrivateRoute>} /> */}
      <Route path="*" element={<div className="p-4">404</div>} />
    </Routes>
  );
}
