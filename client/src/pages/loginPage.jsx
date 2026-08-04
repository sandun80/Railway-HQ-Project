import Navbar from "../components/Navbar";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();

    function handleLogin(e){

        e.preventDefault();

 // later check username/password

        navigate("/dashboard");

    }

  return (
    <>
    <Navbar />
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Please sign in to continue</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          
        </form>
      </div>
    </div>
    </>
  );
}

export default LoginPage;