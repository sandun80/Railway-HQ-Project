import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">

      <Navbar />

      <div className="body-layout">
        <Sidebar />

        <main className="content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default Layout;