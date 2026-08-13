import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRoles, excludedRoles }) {

    const token = localStorage.getItem("token");

    // No token → login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {

        const decoded = jwtDecode(token);

        console.log("Logged in user:", decoded);

        // Check role
        if (
            allowedRoles &&
            !allowedRoles.includes(decoded.role)
        ) {
            return <Navigate to="/unauthorized" replace />;
        }

        if (
            excludedRoles &&
            excludedRoles.includes(decoded.role)
        ) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;

    } catch (error) {

        console.error("Invalid token:", error);

        localStorage.removeItem("token");

        return <Navigate to="/" replace />;
    }
}

export default ProtectedRoute;