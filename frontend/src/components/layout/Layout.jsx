import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }){
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-none d-md-block col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>
        <div className="col-12 col-md-9 col-lg-10 p-0">
          <Topbar />
          <main className="p-3 p-md-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
