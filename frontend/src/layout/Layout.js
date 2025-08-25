import { useState } from "react";
import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "bi-speedometer2" },
  { to: "/productos", label: "Productos", icon: "bi-box-seam" },
  { to: "/proveedores", label: "Proveedores", icon: "bi-truck" },
  { to: "/usuarios", label: "Usuarios", icon: "bi-people" },
  { to: "/maquinaria", label: "Maquinaria", icon: "bi-gear-wide-connected" },
  { to: "/entradas", label: "Entradas", icon: "bi-arrow-down-circle" },
  { to: "/salidas", label: "Salidas", icon: "bi-arrow-up-circle" },
  { to: "/reportes", label: "Reportes", icon: "bi-clipboard-data" },

];

export default function Layout({ children, onLogout, isAuthed }) {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container fluid>
          <button className="btn btn-outline-light me-2" onClick={()=>setShow(true)}>
            <i className="bi bi-list"></i>
          </button>
          <Navbar.Brand as={Link} to="/">SpecialWash</Navbar.Brand>
          <Nav className="ms-auto">
            {isAuthed && (
              <button className="btn btn-outline-light" onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Salir
              </button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={()=>setShow(false)} backdrop>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navItems.map(item => (
              <Nav.Link
                as={Link}
                to={item.to}
                key={item.to}
                onClick={()=>setShow(false)}
                className={pathname === item.to ? "fw-bold" : ""}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container className="pb-5">
        {children}
      </Container>
    </>
  );
}
