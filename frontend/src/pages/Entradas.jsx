import { useEffect, useMemo, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { apiFetch, getProductos, getProveedores } from "../api";

export default function Entradas() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [show, setShow] = useState(false);

  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const empty = {
    producto_id: "", proveedor_id: "",
    cantidad: 0,
    tipo_documento: "factura",
    numero_documento: "",
    precio_bruto_sin_iva: "",     // ➕
    descuento_porcentaje: "",     // ➕
    descuento_importe: "",        // ➕
    precio_sin_iva: "",           // NETO
    iva_porcentaje: 21,
    precio_con_iva: "",
  };
  const [form, setForm] = useState(empty);

  const productoSel = useMemo(
    () => productos.find(p => String(p.id) === String(form.producto_id)),
    [productos, form.producto_id]
  );

  const load = async () => {
    try { setItems(await apiFetch("/api/registro-entrada")); }
    catch(e){ setErr(String(e)); }
  };
  const loadCatalogos = async () => {
    try {
      const [prods, provs] = await Promise.all([getProductos(), getProveedores()]);
      setProductos(prods); setProveedores(provs);
    } catch(e){ setErr(String(e)); }
  };
  useEffect(()=>{ load(); loadCatalogos(); }, []);

  const open = () => { setForm(empty); setShow(true); };

  // —— CÁLCULOS EN VIVO ——
  const toNum = (v) => (v === "" || v === null || v === undefined) ? "" : Number(v);

  const recalcFromBruto = (next) => {
    const bruto = Number(next.precio_bruto_sin_iva || 0);
    const pct   = Number(next.descuento_porcentaje || 0);
    const imp   = Number(next.descuento_importe || 0);
    let neto = bruto;
    if (!isNaN(pct) && pct !== 0) neto -= (bruto * (pct/100));
    if (!isNaN(imp) && imp !== 0) neto -= imp;
    neto = Math.round(neto * 100) / 100;
    next.precio_sin_iva = isNaN(neto) ? "" : neto;

    const iva = Number(next.iva_porcentaje || 0);
    const con = Math.round(neto * (1 + (iva/100)) * 100) / 100;
    next.precio_con_iva = isNaN(con) ? "" : con;
    return next;
  };

  const recalcFromNeto = (next) => {
    const neto = Number(next.precio_sin_iva || 0);
    const iva  = Number(next.iva_porcentaje || 0);
    const con  = Math.round(neto * (1 + (iva/100)) * 100) / 100;
    next.precio_con_iva = isNaN(con) ? "" : con;
    return next;
  };

  const recalcFromConIva = (next) => {
    const con  = Number(next.precio_con_iva || 0);
    const iva  = Number(next.iva_porcentaje || 0);
    const neto = Math.round((con / (1 + (iva/100))) * 100) / 100;
    next.precio_sin_iva = isNaN(neto) ? "" : neto;
    return next;
  };

  // Handlers
  const setAndCalc = (patch, mode) => {
    let next = { ...form, ...patch };
    if (mode === "bruto") next = recalcFromBruto(next);
    if (mode === "neto")  next = recalcFromNeto(next);
    if (mode === "con")   next = recalcFromConIva(next);
    setForm(next);
  };

  const save = async () => {
    try {
      const body = {
        producto_id: form.producto_id,
        proveedor_id: form.proveedor_id || null,
        cantidad: Number(form.cantidad),
        tipo_documento: form.tipo_documento,
        numero_documento: form.numero_documento || null,
        precio_bruto_sin_iva: form.precio_bruto_sin_iva === "" ? null : Number(form.precio_bruto_sin_iva),
        descuento_porcentaje: form.descuento_porcentaje === "" ? null : Number(form.descuento_porcentaje),
        descuento_importe: form.descuento_importe === "" ? null : Number(form.descuento_importe),
        precio_sin_iva: form.precio_sin_iva === "" ? null : Number(form.precio_sin_iva),
        iva_porcentaje: form.iva_porcentaje === "" ? null : Number(form.iva_porcentaje),
        precio_con_iva: form.precio_con_iva === "" ? null : Number(form.precio_con_iva),
      };
      await apiFetch("/api/registro-entrada", { method:"POST", body });
      setShow(false); await load();
    } catch(e){ setErr(String(e)); }
  };

  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-auto"><i className="bi bi-arrow-down-circle me-2"></i>Entradas</h2>
        <Button variant="primary" onClick={open}><i className="bi bi-plus-lg me-1"></i>Nueva</Button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      <Table hover responsive className="align-middle shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Producto</th><th>Proveedor</th><th>Cant.</th>
            <th>Doc</th><th>Núm.</th>
            <th>Bruto €</th><th>Desc %</th><th>Desc €</th>
            <th>Neto €</th><th>IVA %</th><th>Total €</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.map(e=>(
            <tr key={e.id}>
              <td>{e.producto_nombre}</td>
              <td>{e.proveedor_nombre || "-"}</td>
              <td>{e.cantidad}</td>
              <td>{e.tipo_documento || "-"}</td>
              <td>{e.numero_documento || "-"}</td>
              <td>{e.precio_bruto_sin_iva ?? "-"}</td>
              <td>{e.descuento_porcentaje ?? "-"}</td>
              <td>{e.descuento_importe ?? "-"}</td>
              <td>{e.precio_sin_iva ?? "-"}</td>
              <td>{e.iva_porcentaje ?? "-"}</td>
              <td>{e.precio_con_iva ?? "-"}</td>
              <td>{e.fecha_entrada.substring(0,10)}</td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={12} className="text-center text-muted py-4">Sin entradas</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={()=>setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Nueva entrada</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form className="row g-3">
            {/* Producto / Proveedor / Cantidad */}
            <Form.Group className="col-md-6">
              <Form.Label>Producto</Form.Label>
              <Form.Select value={form.producto_id} onChange={e=>setForm({...form, producto_id:e.target.value})}>
                <option value="">Selecciona un producto…</option>
                {productos.map(p=>(
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.categoria ? `(${p.categoria})` : ""}
                  </option>
                ))}
              </Form.Select>
              {productoSel && (
                <div className="form-text">
                  Stock actual: <b>{productoSel.stock_actual}</b> · Mínimo: {productoSel.stock_minimo}
                </div>
              )}
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Proveedor</Form.Label>
              <Form.Select value={form.proveedor_id} onChange={e=>setForm({...form, proveedor_id:e.target.value})}>
                <option value="">(Opcional) Selecciona proveedor…</option>
                {proveedores.map(p=>(<option key={p.id} value={p.id}>{p.nombre}</option>))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control type="number" min={1} value={form.cantidad} onChange={e=>setForm({...form, cantidad:e.target.value})}/>
            </Form.Group>
            <Form.Group className="col-md-3">
              <Form.Label>Documento</Form.Label>
              <Form.Select value={form.tipo_documento} onChange={e=>setForm({...form, tipo_documento:e.target.value})}>
                <option value="factura">Factura</option>
                <option value="albaran">Albarán</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Número</Form.Label>
              <Form.Control value={form.numero_documento} onChange={e=>setForm({...form, numero_documento:e.target.value})}/>
            </Form.Group>

            {/* Precios y descuentos */}
            <Form.Group className="col-md-4">
              <Form.Label>Bruto sin IVA (€)</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.precio_bruto_sin_iva}
                onChange={e=>setAndCalc({ precio_bruto_sin_iva: e.target.value }, "bruto")}
              />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Descuento %</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.descuento_porcentaje}
                onChange={e=>setAndCalc({ descuento_porcentaje: e.target.value }, "bruto")}
              />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Descuento (€)</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.descuento_importe}
                onChange={e=>setAndCalc({ descuento_importe: e.target.value }, "bruto")}
              />
            </Form.Group>

            <Form.Group className="col-md-4">
              <Form.Label>Neto sin IVA (€)</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.precio_sin_iva}
                onChange={e=>setAndCalc({ precio_sin_iva: e.target.value }, "neto")}
              />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>IVA %</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.iva_porcentaje}
                onChange={e=>setAndCalc({ iva_porcentaje: e.target.value }, "neto")}
              />
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Total con IVA (€)</Form.Label>
              <Form.Control type="number" step="0.01"
                value={form.precio_con_iva}
                onChange={e=>setAndCalc({ precio_con_iva: e.target.value }, "con")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={save}
            disabled={!form.producto_id || Number(form.cantidad) <= 0}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
