import { useAuth } from "../../auth/AuthContext";

export default function Topbar(){
  const { user, logout } = useAuth();
  return (
    <div className="topbar px-3 py-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-secondary d-md-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar">
          <i className="bi bi-list"></i>
        </button>
        <h5 className="m-0">Panel</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted small">{user?.email}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
          <i className="bi bi-box-arrow-right me-1"></i> Salir
        </button>
      </div>
    </div>
  );
}
