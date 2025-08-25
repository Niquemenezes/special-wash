import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch } from "../api";

export default function Usuarios() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { nombre:"", email:"", rol:"empleado", password:"" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    try { setItems(await apiFetch("/api/usuarios")); }
    catch(e){ setErr(String(e)); }
  };
  useEffect(()=>{ load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShow(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, password:"" }); setShow(true); };

  const save = async () => {
    try {
      if (editing) {
        const updated = await apiFetch(`/api/usuarios/${editing.id}`, { method:"PUT", body:form });
        setItems(prev => prev.map(x=> x.id===updated.id? updated : x));
      } else {
        const created = await apiFetch("/api/usuarios", { method:"POST", body:form });
        setItems(prev => [created, ...prev]);
      }
      setShow(false);
    } catch(e){ setErr(String(e)); }
  };

  const remove = async (u) => {
    if (!window.confirm(`Eliminar usuario "${u.nombre}"?`)) return;
    try {
      await apiFetch(`/api/usuarios/${u.id}`, { method:"DELETE" });
      setItems(prev => prev.filter(x=> x.id!==u.id));
    } catch(e){ setErr(String(e)); }
  };

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-people me-2"></i>Usuarios</h2>
        <Button variant="primary" onClick={openNew}><i className="bi bi-plus-lg me-1"></i>Nuevo</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th><th>Email</th><th>Rol</th><th style={{width:160}}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(u=>(
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td><span className="badge text-bg-info">{u.rol}</span></td>
              <td className="text-end">
                <Button size="sm" variant="outline-light" className="me-2" onClick={()=>openEdit(u)}><i className="bi bi-pencil"></i></Button>
                <Button size="sm" variant="outline-danger" onClick={()=>remove(u)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={4} className="text-center text-muted py-4">Sin usuarios</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton><Modal.Title>{editing? "Editar usuario" : "Nuevo usuario"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form className="vstack gap-3">
            <Form.Group><Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />
            </Form.Group>
            <Form.Group><Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </Form.Group>
            <Form.Group><Form.Label>Rol</Form.Label>
              <Form.Select value={form.rol} onChange={e=>setForm({...form, rol:e.target.value})}>
                <option value="administrador">Administrador</option>
                <option value="empleado">Empleado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group><Form.Label>{editing? "Nueva contraseña (opcional)" : "Contraseña"}</Form.Label>
              <Form.Control type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
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
