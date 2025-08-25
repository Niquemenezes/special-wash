export default function Dashboard() {
  return (
    <div className="py-3">
      <h2 className="mb-3"><i className="bi bi-speedometer2 me-2"></i>Dashboard</h2>
      <p className="text-muted">Bienvenida, Monique. Aquí pondremos KPIs de stock, alertas y actividad reciente.</p>
      <div className="row g-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="bi bi-box-seam fs-3 me-3"></i>
                <div>
                  <div className="small text-muted">Productos</div>
                  <div className="fs-5">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* más tarjetas… */}
      </div>
    </div>
  );
}
