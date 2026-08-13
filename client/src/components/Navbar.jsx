import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [lettersOpen, setLettersOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "officer";

  const clearTokens = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { label: "Admin Portal", to: "/admin" },
        { label: "User Management", to: "/userlist" }
      ];
    }

    if (role === "viewer") {
      return [{ label: "All Letters", to: "/allletters" }];
    }

    if (role === "replyperson") {
      return [{ label: "Inbox", to: "/inbox" }];
    }

    return [
      { label: "Dashboard", to: "/dashboard" },
      {
        label: "Letters",
        children: [
          { label: "Sending", to: "/letters/sending" },
          { label: "Receiving", to: "/letters/receiving" }
        ]
      },
      { label: "Reports", to: "/reports" },
      { label: "All Letters", to: "/allletters" }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <nav className="railway-header">
      <div className="railway-brand-bar">
        <div className="brand-wrap">
          <img src={logo} alt="Sri Lanka Railways Logo" className="navbar-logo" />

          <div className="navbar-title">
            <h2>Sri Lanka Railways</h2>
            <p>Official Document Management System</p>
          </div>
        </div>

        <div className="brand-tools">
          <div className="gov-links">
            <span className="lang-toggle">English</span>
            <span className="lang-toggle">Sinhala</span>
            <span className="lang-toggle">Tamil</span>
          </div>
        </div>
      </div>

      <div className="railway-nav-bar">
        {menuItems.map((item) =>
          item.children ? (
            <div key={item.label} className="nav-dropdown">
              <button
                type="button"
                className="nav-link nav-dropdown-toggle"
                onClick={() => setLettersOpen(!lettersOpen)}
              >
                {item.label}
                <span>{lettersOpen ? "▲" : "▼"}</span>
              </button>

              {lettersOpen && (
                <div className="nav-dropdown-menu">
                  {item.children.map((child) => (
                    <Link key={child.label} to={child.to} className="nav-dropdown-item">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={item.label} to={item.to} className="nav-link">
              {item.label}
            </Link>
          )
        )}

        <button type="button" className="nav-logout" onClick={clearTokens}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;