import { useEffect, useMemo, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch, getProductos } from "../api";

export default function Salidas() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  // catálogo
  const [productos, setProductos] = useState([]);

  // form
  const [form, setForm] = useState({ producto_id:"", cantidad:0 });

  const productoSel = useMemo(
    () => productos.find(p => String(p.id) === String(form.producto_id)),
    [productos, form.producto_id]
  );

  const load = async () => {
    try { setItems(await apiFetch("/api/registro-salida")); }
    catch(e){ setErr(String(e)); }
  };

  const loadCatalogos = async () => {
    try { setProductos(await getProductos()); }
    catch(e){ setErr(String(e)); }
  };

  useEffect(()=>{ load(); loadCatalogos(); }, []);

  const open = () => { setForm({ producto_id:"", cantidad:0 }); setShow(true); };

  const save = async () => {
    try {
      await apiFetch("/api/registro-salida", {
        method:"POST",
        body:{ ...form, cantidad: Number(form.cantidad) }
      });
      setShow(false);
      await load();
    } catch(e){ setErr(String(e)); }
  };

  const cantidadOK = useMemo(()=>{
    const n = Number(form.cantidad||0);
    if (!productoSel) return false;
    return n > 0 && n <= Number(productoSel.stock_actual||0);
  }, [form.cantidad, productoSel]);

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-arrow-up-circle me-2"></i>Salidas</h2>
        <Button variant="primary" onClick={open}><i className="bi bi-plus-lg me-1"></i>Nueva</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Producto</th><th>Cantidad</th><th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s=>(
            <tr key={s.id}>
              <td>{s.producto_nombre}</td>
              <td>{s.cantidad}</td>
              <td>{s.fecha_salida.substring(0,10)}</td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={3} className="text-center text-muted py-4">Sin salidas</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Nueva salida</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form className="vstack gap-3">
            <Form.Group>
              <Form.Label>Producto</Form.Label>
              <Form.Select
                value={form.producto_id}
                onChange={e=>setForm({...form, producto_id:e.target.value})}
              >
                <option value="">Selecciona un producto…</option>
                {productos.map(p=>(
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.categoria ? `(${p.categoria})` : ""}
                  </option>
                ))}
              </Form.Select>
              {productoSel && (
                <div className="form-text">
                  Stock disponible: <b>{productoSel.stock_actual}</b> · Mínimo: {productoSel.stock_minimo}
                </div>
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.cantidad}
                onChange={e=>setForm({...form, cantidad:e.target.value})}
                isInvalid={!!productoSel && Number(form.cantidad) > Number(productoSel.stock_actual||0)}
              />
              <Form.Control.Feedback type="invalid">
                La cantidad no puede superar el stock disponible.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
          <Button variant="primary" onClick={save} disabled={!cantidadOK || !form.producto_id}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
