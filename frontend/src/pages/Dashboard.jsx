export default function Dashboard(){
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card card-soft p-3">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-3 text-primary"><i className="bi bi-basket3"></i></div>
            <div>
              <div className="text-muted small">Productos</div>
              <div className="fs-4 fw-bold">—</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card card-soft p-3">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-3 text-success"><i className="bi bi-box-arrow-in-down"></i></div>
            <div>
              <div className="text-muted small">Entradas (hoy)</div>
              <div className="fs-4 fw-bold">—</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card card-soft p-3">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-3 text-danger"><i className="bi bi-box-arrow-up"></i></div>
            <div>
              <div className="text-muted small">Salidas (hoy)</div>
              <div className="fs-4 fw-bold">—</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3">
        <div className="card card-soft p-3">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-3 text-info"><i className="bi bi-people"></i></div>
            <div>
              <div className="text-muted small">Usuarios</div>
              <div className="fs-4 fw-bold">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
