import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar() {

  const [lettersOpen, setLettersOpen] = useState(false);

  return (
    <aside className="sidebar">

      <Link to="/dashboard">
        Dashboard
      </Link>


      {/* Letters Dropdown */}
      <div className="dropdown">

        <button 
          className="dropdown-btn"
          onClick={() => setLettersOpen(!lettersOpen)}
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

      <Link to="/" id="logout-btn"> 
        Logout
      </Link>


    </aside>
  );
}

export default Sidebar;