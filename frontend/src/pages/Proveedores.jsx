import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch } from "../api";

export default function Proveedores() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre:"", contacto:"", telefono:"" });

  const load = async () => {
    try { setItems(await apiFetch("/api/proveedores")); }
    catch(e){ setErr(String(e)); }
  };
  useEffect(()=>{ load(); }, []);

  const openNew = () => { setEditing(null); setForm({ nombre:"", contacto:"", telefono:"" }); setShow(true); };
  const openEdit = (p) => { setEditing(p); setForm(p); setShow(true); };

  const save = async () => {
    try {
      if (editing) {
        const updated = await apiFetch(`/api/proveedores/${editing.id}`, { method:"PUT", body:form });
        setItems(prev => prev.map(x => x.id===updated.id ? updated : x));
      } else {
        const created = await apiFetch("/api/proveedores", { method:"POST", body:form });
        setItems(prev => [created, ...prev]);
      }
      setShow(false);
    } catch(e){ setErr(String(e)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Eliminar proveedor "${p.nombre}"?`)) return;
    try {
      await apiFetch(`/api/proveedores/${p.id}`, { method:"DELETE" });
      setItems(prev => prev.filter(x => x.id !== p.id));
    } catch(e){ setErr(String(e)); }
  };

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-truck me-2"></i>Proveedores</h2>
        <Button variant="primary" onClick={openNew}><i className="bi bi-plus-lg me-1"></i>Nuevo</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th><th>Contacto</th><th>Teléfono</th><th style={{width:160}}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.contacto || "-"}</td>
              <td>{p.telefono || "-"}</td>
              <td className="text-end">
                <Button size="sm" variant="outline-light" className="me-2" onClick={()=>openEdit(p)}><i className="bi bi-pencil"></i></Button>
                <Button size="sm" variant="outline-danger" onClick={()=>remove(p)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={4} className="text-center text-muted py-4">Sin proveedores</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton><Modal.Title>{editing? "Editar proveedor" : "Nuevo proveedor"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form className="vstack gap-3">
            <Form.Group><Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />
            </Form.Group>
            <Form.Group><Form.Label>Contacto</Form.Label>
              <Form.Control value={form.contacto||""} onChange={e=>setForm({...form, contacto:e.target.value})} />
            </Form.Group>
            <Form.Group><Form.Label>Teléfono</Form.Label>
              <Form.Control value={form.telefono||""} onChange={e=>setForm({...form, telefono:e.target.value})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
          <Button variant="primary" onClick={save}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
