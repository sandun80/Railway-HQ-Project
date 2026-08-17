import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lettersOpen, setLettersOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [incomingMails, setIncomingMails] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const prevMailsCountRef = useRef(-1);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || "officer";
  const username = user?.username || "";

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

  // Poll for incoming mails
  useEffect(() => {
    if (!user) return;

    const fetchIncomingMails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/letters/getlettersforreply", {
          params: { role: role, username: username }
        });
        const mails = Array.isArray(response.data) ? response.data : [];
        setIncomingMails(mails);

        if (prevMailsCountRef.current !== -1 && mails.length > prevMailsCountRef.current) {
          const newest = mails[0];
          setToastMessage({
            title: "New Mail Received",
            body: `From: ${newest?.sender || "Officer"} (${newest?.letterNumber || "Letter"})`,
            id: newest?._id
          });
          setTimeout(() => setToastMessage(null), 6000);
        }
        prevMailsCountRef.current = mails.length;
      } catch (error) {
        console.error("Failed to fetch notification mails:", error);
      }
    };

    fetchIncomingMails();
    const interval = setInterval(fetchIncomingMails, 8000);
    return () => clearInterval(interval);
  }, [role, username]);

  // Close dropdown & drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLettersOpen(false);
      }
      if (drawerRef.current && !drawerRef.current.contains(event.target) && !event.target.closest(".nav-notification-btn")) {
        setShowDrawer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { label: t("navbar.adminPortal"), to: "/admin" },
        { label: t("navbar.userManagement"), to: "/userlist" },
        { label: t("navbar.historyLogs", "History Logs"), to: "/logs" }
      ];
    }

    if (role === "viewer") {
      return [
        { label: t("navbar.allLetters"), to: "/allletters" },
        { label: t("navbar.historyLogs", "History Logs"), to: "/logs" }
      ]; 0
    }

    if (role === "officer") {
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
        { label: t("navbar.allLetters"), to: "/allletters" },
        { label: t("navbar.historyLogs", "History Logs"), to: "/logs" }
      ];
    }

    // All reply/recipient roles (e.g. gmr, replyperson, staff)
    return [
      { label: t("navbar.inbox", "Inbox"), to: "/inbox" },
      { label: t("navbar.allLetters"), to: "/allletters" },
      { label: t("navbar.historyLogs", "History Logs"), to: "/logs" }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
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
              <span
                className={`lang-toggle ${i18n.language === "ta" ? "active-lang" : ""}`}
                onClick={() => changeLanguage("ta")}
                role="button"
                tabIndex={0}
              >
                {t("navbar.tamil")}
              </span>
            </div>

            {/* Notification Bell Button */}
            <button
              type="button"
              className="nav-notification-btn"
              onClick={() => setShowDrawer(!showDrawer)}
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {incomingMails.length > 0 && (
                <span className="notification-count-badge">{incomingMails.length}</span>
              )}
            </button>
          </div>
        </div>

        <div className="railway-nav-bar">
          {menuItems.map((item) =>
            item.children ? (
              <div key={item.label} className="nav-dropdown" ref={dropdownRef}>
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
                      <Link
                        key={child.label}
                        to={child.to}
                        className="nav-dropdown-item"
                        onClick={() => setLettersOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="nav-link"
                onClick={() => setLettersOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}

          {username && (
            <div className="nav-user-badge">
              <span className="user-avatar">{username.charAt(0).toUpperCase()}</span>
              <div className="user-info">
                <span className="user-name">{username}</span>
                <span className="user-role">{role}</span>
              </div>
            </div>
          )}

          <button type="button" className="nav-logout" onClick={clearTokens}>
            {t("common.logout")}
          </button>
        </div>
      </nav>

      {/* Floating Notification Toast Popup */}
      {toastMessage && (
        <div className="notification-toast-popup">
          <div className="toast-content">
            <span className="toast-icon">📩</span>
            <div>
              <strong>{toastMessage.title}</strong>
              <p>{toastMessage.body}</p>
            </div>
          </div>
          <button
            type="button"
            className="toast-action-btn"
            onClick={() => {
              setToastMessage(null);
              navigate("/inbox");
            }}
          >
            Open Inbox
          </button>
        </div>
      )}

      {/* Slide-out Side Notification Panel */}
      {showDrawer && (
        <div className="side-notification-drawer" ref={drawerRef}>
          <div className="drawer-header">
            <div className="drawer-title-wrap">
              <h3>Received Mail Notifications</h3>
              <span className="drawer-count-pill">{incomingMails.length} Total</span>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={() => setShowDrawer(false)}
            >
              ×
            </button>
          </div>

          <div className="drawer-body">
            {incomingMails.length === 0 ? (
              <div className="drawer-empty-state">
                <p>No new mail notifications received.</p>
              </div>
            ) : (
              incomingMails.map((mail) => (
                <div key={mail._id} className="drawer-mail-card">
                  <div className="card-sender-row">
                    <span className="sender-tag">From: {mail.sender || mail.receiver || "Officer"}</span>
                    <span className="date-tag">
                      {mail.letterDate
                        ? new Date(mail.letterDate).toLocaleDateString()
                        : new Date(mail.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="mail-ref-no">{mail.letterNumber}</h4>
                  <p className="mail-category-text">
                    Category: {mail.category} • Status: {mail.status || "Pending"}
                  </p>

                  <button
                    type="button"
                    className="drawer-view-btn"
                    onClick={() => {
                      setShowDrawer(false);
                      navigate("/inbox");
                    }}
                  >
                    View in Inbox
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;