import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import logo from "../assets/logo.png";
import bgImage from "../assets/bg.png";

function LoginPage() {

    const navigate = useNavigate();
    const { t } = useTranslation();

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
                    username: username.trim(),
                    password: password.trim()
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
            else {
              navigate("/inbox");
            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                t("login.loginFailed")
            );
        }
    };

    return (
        <>
            <div className="login-container" style={{ backgroundImage: `url(${bgImage})` }}>

                <div className="login-card">

                    {/* Top Branding Section */}
                    <div className="login-brand-section">
                        <img src={logo} alt="Sri Lanka Railways Logo" className="login-logo" />
                        <h2 className="login-org-title">Sri Lanka Railways</h2>
                        <span className="login-org-tagline-badge">{t("navbar.orgTagline")}</span>
                    </div>

                    {/* Form & Welcome Section */}
                    <div className="login-form-body">
                        <h1 className="login-welcome-title">{t("login.welcome")}</h1>
                        <p className="login-welcome-subtitle">{t("login.subtitle")}</p>

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleLogin}>

                            <div className="input-group">

                                <label>{t("login.username")}</label>

                                <input
                                    type="text"
                                    placeholder={t("login.usernamePlaceholder")}
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="input-group">

                                <label>{t("login.password")}</label>

                                <input
                                    type="password"
                                    placeholder={t("login.passwordPlaceholder")}
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
                                {t("login.loginBtn")}
                            </button>

                        </form>
                    </div>

                </div>

            </div>
        </>
    );
}

export default LoginPage;