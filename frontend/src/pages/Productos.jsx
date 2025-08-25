import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch } from "../api";

export default function Productos() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ nombre:"", categoria:"", stock_minimo:0, stock_actual:0 });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    try { setItems(await apiFetch("api/productos")); }
    catch(e){ setErr(String(e)); }
  };

  useEffect(()=>{ load(); }, []);

  const openNew = () => { setEditing(null); setForm({ nombre:"", categoria:"", stock_minimo:0, stock_actual:0 }); setShow(true); };
  const openEdit = (p) => { setEditing(p); setForm(p); setShow(true); };

  const save = async () => {
    try {
      if (editing) {
        const updated = await apiFetch(`api/productos/${editing.id}`, { method:"PUT", body:form });
        setItems(prev=> prev.map(x=> x.id===updated.id? updated : x));
      } else {
        const created = await apiFetch("api/productos", { method:"POST", body:form });
        setItems(prev=> [created, ...prev]);
      }
      setShow(false);
    } catch(e){ setErr(String(e)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Eliminar "${p.nombre}"?`)) return;
    try {
      await apiFetch(`api/productos/${p.id}`, { method:"DELETE" });
      setItems(prev=> prev.filter(x=> x.id!==p.id));
    } catch(e){ setErr(String(e)); }
  };

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-box-seam me-2"></i>Productos</h2>
        <Button variant="primary" onClick={openNew}><i className="bi bi-plus-lg me-1"></i>Nuevo</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Nombre</th><th>Categoría</th><th>Stock</th><th>Mínimo</th><th style={{width:160}}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(p=>(
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.categoria || "-"}</td>
              <td><span className={`badge ${p.stock_actual<=p.stock_minimo?'text-bg-danger':'text-bg-success'}`}>{p.stock_actual}</span></td>
              <td>{p.stock_minimo}</td>
              <td className="text-end">
                <Button size="sm" variant="outline-secondary" className="me-2" onClick={()=>openEdit(p)}>
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button size="sm" variant="outline-danger" onClick={()=>remove(p)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={5} className="text-center text-muted py-4">No hay productos</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing? "Editar producto" : "Nuevo producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="vstack gap-3">
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Control value={form.categoria||""} onChange={e=>setForm({...form, categoria:e.target.value})} />
            </Form.Group>
            <div className="d-flex gap-3">
              <Form.Group className="flex-fill">
                <Form.Label>Stock actual</Form.Label>
                <Form.Control type="number" value={form.stock_actual} onChange={e=>setForm({...form, stock_actual:+e.target.value})} />
              </Form.Group>
              <Form.Group className="flex-fill">
                <Form.Label>Stock mínimo</Form.Label>
                <Form.Control type="number" value={form.stock_minimo} onChange={e=>setForm({...form, stock_minimo:+e.target.value})} />
              </Form.Group>
            </div>
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
