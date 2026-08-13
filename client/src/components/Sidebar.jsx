import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Sidebar.css";

function Sidebar() {

    const [lettersOpen, setLettersOpen] = useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    function clearTokens() {

        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/", { replace: true });
    }

    return (
        <aside className="sidebar">

            {/* OFFICER */}
            {role === "officer" && (
                <>
                    <Link to="/dashboard">
                        {t("navbar.dashboard")}
                    </Link>

                    {/* Letters Dropdown */}
                    <div className="dropdown">

                        <button
                            className="dropdown-btn"
                            onClick={() =>
                                setLettersOpen(!lettersOpen)
                            }
                        >
                            {t("navbar.letters")}

                            <span>
                                {lettersOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {lettersOpen && (
                            <div className="dropdown-menu">

                                <Link to="/letters/sending">
                                    {t("navbar.sending")}
                                </Link>

                                <Link to="/letters/receiving">
                                    {t("navbar.receiving")}
                                </Link>

                            </div>
                        )}

                    </div>

                    <Link to="/reports">
                        {t("navbar.reports")}
                    </Link>

                    <Link to="/allletters">
                        {t("navbar.allLetters")}
                    </Link>
                </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
                <>
                    <Link to="/admin">
                        {t("navbar.adminPortal")}
                    </Link>

                    <Link to= "/userlist">
                        {t("navbar.userManagement")}
                    </Link>
                </>
            )}

            {/* VIEWER */}
            {role === "viewer" && (
                <>
                    <Link to="/dashboard">
                        {t("navbar.dashboard")}
                    </Link>
                    
                    <Link to="/allletters">
                        {t("navbar.allLetters")}
                    </Link>
                </>
            )}

            {/* REPLY PERSON */}
            {role === "replyperson" && (
                <>
                    <Link to="/inbox">
                        {t("navbar.inbox")}
                    </Link>
                </>
            )}

            {/* LOGOUT */}
            <button
                type="button"
                id="logout-btn"
                onClick={clearTokens}
            >
                {t("common.logout")}
            </button>

        </aside>
    );
}

export default Sidebar;