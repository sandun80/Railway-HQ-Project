import Navbar from "../components/Navbar";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username,
                    password
                }
            );

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", response.data.user.role);

            // Save JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            console.log(response.data.user);
            

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            console.log(localStorage.getItem("user"));
            
            

            // Get role
            const role = response.data.user.role;    
            
            // Navigate based on role
            if (role === "officer") {          
                navigate("/dashboard");
            } 
            else if (role === "admin") {
                navigate("/admin");
                
            } 
            else if (role === "viewer") {
                navigate("/allletters");
                
            }
            else if (role == "replyperson") {
              alert("Not yet implemented");
            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="login-container">

                <div className="login-card">

                    <h1>Welcome Back</h1>

                    <p>
                        Please sign in to continue
                    </p>

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin}>

                        <div className="input-group">

                            <label>Username</label>

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            Login
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}

export default LoginPage;