import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../css/Forms.css";
import logo from "../assets/images/JöraLogo.png";
import { API_URL } from "../utils/api";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access_token, data.refresh_token);
        navigate("/home", { replace: true });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Inloggning misslyckades");
      }
    } catch {
      setError("Något gick fel. Försök igen.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        {message && <p className="success">{message}</p>}
        <img src={logo} alt="Jöra logo" className="logo" />

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <label htmlFor="identifier">Användarnamn eller e-post</label>
          <input
            id="identifier"
            type="text"
            placeholder="Användarnamn eller e-post"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Glömt lösenord-länk */}
          <p style={{ marginTop: "10px", textAlign: "right" }}>
            <Link to="/forgot-password">Glömt lösenord?</Link>
          </p>

          <button type="submit">Logga in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;




