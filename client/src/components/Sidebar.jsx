import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar() {

    const [lettersOpen, setLettersOpen] = useState(false);

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
                        Dashboard
                    </Link>

                    {/* Letters Dropdown */}
                    <div className="dropdown">

                        <button
                            className="dropdown-btn"
                            onClick={() =>
                                setLettersOpen(!lettersOpen)
                            }
                        >
                            Letters

                            <span>
                                {lettersOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {lettersOpen && (
                            <div className="dropdown-menu">

                                <Link to="/letters/sending">
                                    Sending
                                </Link>

                                <Link to="/letters/receiving">
                                    Receiving
                                </Link>

                            </div>
                        )}

                    </div>

                    <Link to="/reports">
                        Reports
                    </Link>

                    <Link to="/allletters">
                        All Letters
                    </Link>
                </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
                <>
                    <Link to="/admin">
                        Admin Portal
                    </Link>

                    <Link to= "/userlist">
                        User Management
                    </Link>
                </>
            )}

            {/* VIEWER */}
            {role === "viewer" && (
                <>
                    <Link to="/allletters">
                        All Letters
                    </Link>
                </>
            )}

            {/* REPLY PERSON */}
            {role === "replyperson" && (
                <>
                    <Link to="/inbox">
                        Inbox
                    </Link>
                </>
            )}

            {/* LOGOUT */}
            <button
                type="button"
                id="logout-btn"
                onClick={clearTokens}
            >
                Logout
            </button>

        </aside>
    );
}

export default Sidebar;