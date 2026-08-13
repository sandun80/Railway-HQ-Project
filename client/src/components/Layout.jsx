import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;