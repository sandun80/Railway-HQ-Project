import { Link, Outlet } from "react-router-dom";
import "../styles/sendingPage.css";

function SendingLetters() {
  return (
    <div className="letters-page letters-page-sending">
      <h2>Sending Letters</h2>

      <div className="button-group">
        <Link to="registered">Registered Post</Link>
        <Link to="normal">Normal Post</Link>
        <Link to="byhand">By Hand</Link>
      </div>

      <Outlet />
    </div>
  );
}

export default SendingLetters;