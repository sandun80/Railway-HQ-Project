import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav>
      <img 
        src={logo} 
        alt="Sri Lanka Railways Logo"
        className="navbar-logo"
      />

      <div className="navbar-title">
        <h2>Sri Lanka Railways</h2>
        <p>Document Management System</p>
      </div>
    </nav>
  );
}

export default Navbar;