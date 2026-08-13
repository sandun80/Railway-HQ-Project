import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lettersOpen, setLettersOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "officer";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

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
        { label: t("navbar.adminPortal"), to: "/admin" },
        { label: t("navbar.userManagement"), to: "/userlist" }
      ];
    }

    if (role === "viewer") {
      return [{ label: t("navbar.allLetters"), to: "/allletters" }];
    }

    if (role === "replyperson") {
      return [{ label: t("navbar.inbox"), to: "/inbox" }];
    }

    return [
      { label: t("navbar.dashboard"), to: "/dashboard" },
      {
        label: t("navbar.letters"),
        children: [
          { label: t("navbar.sending"), to: "/letters/sending" },
          { label: t("navbar.receiving"), to: "/letters/receiving" }
        ]
      },
      { label: t("navbar.reports"), to: "/reports" },
      { label: t("navbar.allLetters"), to: "/allletters" }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <nav className="railway-header">
      <div className="railway-brand-bar">
        <div className="brand-wrap">
          <img src={logo} alt="Sri Lanka Railways Logo" className="navbar-logo" />

          <div className="navbar-title">
            <h2>{t("navbar.orgName")}</h2>
            <p>{t("navbar.orgTagline")}</p>
          </div>
        </div>

        <div className="brand-tools">
          <div className="gov-links">
            <span
              className={`lang-toggle ${i18n.language === "en" ? "active-lang" : ""}`}
              onClick={() => changeLanguage("en")}
              role="button"
              tabIndex={0}
            >
              {t("navbar.english")}
            </span>
            <span
              className={`lang-toggle ${i18n.language === "si" ? "active-lang" : ""}`}
              onClick={() => changeLanguage("si")}
              role="button"
              tabIndex={0}
            >
              {t("navbar.sinhala")}
            </span>
            <span className="lang-toggle">{t("navbar.tamil")}</span>
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
          {t("common.logout")}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;