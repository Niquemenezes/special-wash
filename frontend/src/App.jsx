// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Panel from "./pages/Panel";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/panel" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/panel"
        element={
          <PrivateRoute>
            <Panel />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<div style={{ padding: 24 }}><h3>404</h3></div>} />
    </Routes>
  );
}
