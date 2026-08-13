import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

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
            <div className="login-container">

                <div className="login-card">

                    <h1>{t("login.welcome")}</h1>

                    <p>
                        {t("login.subtitle")}
                    </p>

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

                    <div style={{ marginTop: "16px", fontSize: "12px", color: "#666", textAlign: "center" }}>
                        <p style={{ margin: 0 }}><strong>{t("login.devAccountsTitle")}</strong></p>
                        <p style={{ margin: "2px 0 0" }}>{t("login.devAdmin")}: <code>admin</code> / <code>admin123</code></p>
                        <p style={{ margin: "2px 0 0" }}>{t("login.devOfficer")}: <code>officer</code> / <code>officer123</code></p>
                    </div>

                </div>

            </div>
        </>
    );
}

export default LoginPage;