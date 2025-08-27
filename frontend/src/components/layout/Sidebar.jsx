import { NavLink } from "react-router-dom";

export default function Sidebar(){
  return (
    <>
      {/* Desktop */}
      <aside className="sidebar d-none d-md-flex flex-column p-3">
        <div className="brand fs-5 mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-droplet-half"></i> SpecialWash
        </div>
        <nav className="nav flex-column gap-1">
          <NavLink to="/panel" className={({isActive})=> "nav-link px-0 " + (isActive ? "active fw-semibold" : "")}>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </NavLink>
          <NavLink to="/productos" className={({isActive})=> "nav-link px-0 " + (isActive ? "active fw-semibold" : "")}>
            <i className="bi bi-basket3 me-2"></i> Productos
          </NavLink>
          <NavLink to="/proveedores" className={({isActive})=> "nav-link px-0 " + (isActive ? "active fw-semibold" : "")}>
            <i className="bi bi-truck me-2"></i> Proveedores
          </NavLink>
          <NavLink to="/entradas" className={({isActive})=> "nav-link px-0 " + (isActive ? "active fw-semibold" : "")}>
            <i className="bi bi-box-arrow-in-down me-2"></i> Entradas
          </NavLink>
          <NavLink to="/salidas" className={({isActive})=> "nav-link px-0 " + (isActive ? "active fw-semibold" : "")}>
            <i className="bi bi-box-arrow-up me-2"></i> Salidas
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Offcanvas */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasSidebar">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">SpecialWash</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column gap-2">
            <NavLink to="/panel" className="nav-link" data-bs-dismiss="offcanvas">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </NavLink>
            <NavLink to="/productos" className="nav-link" data-bs-dismiss="offcanvas">
              <i className="bi bi-basket3 me-2"></i> Productos
            </NavLink>
            <NavLink to="/proveedores" className="nav-link" data-bs-dismiss="offcanvas">
              <i className="bi bi-truck me-2"></i> Proveedores
            </NavLink>
            <NavLink to="/entradas" className="nav-link" data-bs-dismiss="offcanvas">
              <i className="bi bi-box-arrow-in-down me-2"></i> Entradas
            </NavLink>
            <NavLink to="/salidas" className="nav-link" data-bs-dismiss="offcanvas">
              <i className="bi bi-box-arrow-up me-2"></i> Salidas
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}
