import { Link, Outlet } from "react-router-dom";
import "../styles/receivingPage.css";

function ReceivingPage(){
    return(
        <div className="letters-page letters-page-receiving">
            <h2>Receiving Letters</h2>
            
            <div className="button-group">
                <Link to="registered">Registered Post</Link>
                <Link to="normal">Normal Post</Link>
                <Link to="byhand">By Hand</Link>
            </div>

            <Outlet />
        </div>
    );
}

export default ReceivingPage;