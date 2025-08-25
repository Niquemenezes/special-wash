import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch } from "../api";

export default function Maquinaria() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { nombre:"", marca:"", modelo:"", numero_serie:"", estado:"operativa", fecha_compra:"", ultima_revision:"", proveedor_id:"" };
  const [form, setForm] = useState(empty);

  const load = async () => {
    try { setItems(await apiFetch("/api/maquinaria")); }
    catch(e){ setErr(String(e)); }
  };
  useEffect(()=>{ load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShow(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({
      ...m,
      fecha_compra: m.fecha_compra?.substring(0,10) || "",
      ultima_revision: m.ultima_revision?.substring(0,10) || "",
      proveedor_id: m.proveedor_id || "",
    });
    setShow(true);
  };

  const save = async () => {
    try {
      const body = { ...form, proveedor_id: form.proveedor_id ? Number(form.proveedor_id) : null };
      if (editing) {
        const updated = await apiFetch(`/api/maquinaria/${editing.id}`, { method:"PUT", body });
        setItems(prev => prev.map(x => x.id===updated.id ? updated : x));
      } else {
        const created = await apiFetch("/api/maquinaria", { method:"POST", body });
        setItems(prev => [created, ...prev]);
      }
      setShow(false);
    } catch(e){ setErr(String(e)); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Eliminar máquina "${m.nombre}"?`)) return;
    try {
      await apiFetch(`/api/maquinaria/${m.id}`, { method:"DELETE" });
      setItems(prev => prev.filter(x => x.id !== m.id));
    } catch(e){ setErr(String(e)); }
  };

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-gear-wide-connected me-2"></i>Maquinaria</h2>
        <Button variant="primary" onClick={openNew}><i className="bi bi-plus-lg me-1"></i>Nueva</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th><th>Marca/Modelo</th><th>Nº serie</th><th>Estado</th><th>Proveedor</th><th>Compra</th><th>Últ. revisión</th><th style={{width:160}}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td>{m.marca || "-"} {m.modelo || ""}</td>
              <td>{m.numero_serie || "-"}</td>
              <td>
                <span className={`badge ${
                  m.estado === "operativa" ? "text-bg-success" :
                  m.estado === "mantenimiento" ? "text-bg-warning" : "text-bg-danger"
                }`}>{m.estado}</span>
              </td>
              <td>{m.proveedor_nombre || "-"}</td>
              <td>{m.fecha_compra ? m.fecha_compra.substring(0,10) : "-"}</td>
              <td>{m.ultima_revision ? m.ultima_revision.substring(0,10) : "-"}</td>
              <td className="text-end">
                <Button size="sm" variant="outline-light" className="me-2" onClick={()=>openEdit(m)}><i className="bi bi-pencil"></i></Button>
                <Button size="sm" variant="outline-danger" onClick={()=>remove(m)}><i className="bi bi-trash"></i></Button>
              </td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={8} className="text-center text-muted py-4">Sin maquinaria</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editing? "Editar máquina" : "Nueva máquina"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control value={form.marca||""} onChange={e=>setForm({...form, marca:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control value={form.modelo||""} onChange={e=>setForm({...form, modelo:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Nº Serie</Form.Label>
              <Form.Control value={form.numero_serie||""} onChange={e=>setForm({...form, numero_serie:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Estado</Form.Label>
              <Form.Select value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                <option value="operativa">Operativa</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="fuera_servicio">Fuera de servicio</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Proveedor (ID)</Form.Label>
              <Form.Control type="number" value={form.proveedor_id||""} onChange={e=>setForm({...form, proveedor_id:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Fecha compra</Form.Label>
              <Form.Control type="date" value={form.fecha_compra||""} onChange={e=>setForm({...form, fecha_compra:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Última revisión</Form.Label>
              <Form.Control type="date" value={form.ultima_revision||""} onChange={e=>setForm({...form, ultima_revision:e.target.value})}/>
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
