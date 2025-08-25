import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { apiFetch, getProductos } from "../api";

export default function Reportes() {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const primerDiaMes = `${yyyy}-${mm}-01`;
  const ultimoDiaMes = new Date(yyyy, hoy.getMonth() + 1, 0).toISOString().slice(0,10);

  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(ultimoDiaMes);
  const [productoId, setProductoId] = useState("");
  const [productos, setProductos] = useState([]);

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getProductos().then(setProductos).catch(e => setErr(String(e)));
  }, []);

  const consultar = async () => {
    try {
      const params = new URLSearchParams();
      if (desde) params.set("desde", desde);
      if (hasta) params.set("hasta", hasta);
      if (productoId) params.set("producto_id", productoId);
      const res = await apiFetch(`/api/reportes/gasto-productos?${params.toString()}`);
      setData(res); setErr("");
    } catch (e) {
      setErr(String(e)); setData(null);
    }
  };

useEffect(() => {
  consultar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  const totalSin = data?.totales?.sin_iva ?? 0;
  const totalCon = data?.totales?.con_iva ?? 0;

  return (
    <div className="py-3">
      <h2 className="mb-3"><i className="bi bi-clipboard-data me-2"></i>Gasto por producto</h2>

      <Card className="mb-3 shadow-sm border-0">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label>Desde</Form.Label>
              <Form.Control type="date" value={desde} onChange={e=>setDesde(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" value={hasta} onChange={e=>setHasta(e.target.value)} />
            </Col>
            <Col md={4}>
              <Form.Label>Producto</Form.Label>
              <Form.Select value={productoId} onChange={e=>setProductoId(e.target.value)}>
                <option value="">Todos los productos</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} {p.categoria ? `(${p.categoria})` : ""}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button className="w-100" variant="primary" onClick={consultar}>
                <i className="bi bi-search me-1"></i>Consultar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {err && <div className="alert alert-danger">{err}</div>}

      {data && (
        <>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-cash-coin fs-3 me-3"></i>
                    <div>
                      <div className="small text-muted">Total sin IVA</div>
                      <div className="fs-4">{totalSin.toFixed(2)} €</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-currency-euro fs-3 me-3"></i>
                    <div>
                      <div className="small text-muted">Total con IVA</div>
                      <div className="fs-4">{totalCon.toFixed(2)} €</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm border-0">
            <Card.Header className="d-flex align-items-center">
              <i className="bi bi-calendar3 me-2"></i> Desglose mensual
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Mes</th>
                    <th>Sin IVA (€)</th>
                    <th>Con IVA (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.mensual.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted py-4">Sin datos en el periodo</td></tr>
                  ) : data.mensual.map(r => (
                    <tr key={r.mes}>
                      <td>{r.mes}</td>
                      <td>{r.sin_iva.toFixed(2)}</td>
                      <td>{r.con_iva.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}
