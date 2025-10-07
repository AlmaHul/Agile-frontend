import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Forms.css";
import logo from "../assets/images/JöraLogo.png";
import { API_URL } from "../utils/api"; //

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend-validering för lösenord som matchar
    if (password !== passwordConfirm) {
      setFieldErrors({ passwordConfirm: "Lösenorden matchar inte" });
      return;
    }

    setError("");
    setFieldErrors({});

    try {
      const response = await fetch(`${API_URL}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // i navigate
navigate("/login", { state: { message: "Du har nu registrerat dig!" } });

      } else {

        if (data.error) {

          const errMsg = data.error.toLowerCase();
          const newFieldErrors = {};

          if (errMsg.includes("användarnamn")) newFieldErrors.username = data.error;
          if (errMsg.includes("e-post") || errMsg.includes("email")) newFieldErrors.email = data.error;
          if (errMsg.includes("lösenord")) newFieldErrors.password = data.error;

          setFieldErrors(newFieldErrors);
          setError(data.error);
        } else {
          setError("Registrering misslyckades");
        }
      }
    } catch {
      setError("Något gick fel. Försök igen.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <img src={logo} alt="Jöra logo" className="logo" />

        <form onSubmit={handleRegister}>
          <label htmlFor="username">Användarnamn</label>
          <input
            id="username"
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {fieldErrors.username && <p className="error">{fieldErrors.username}</p>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && <p className="error">{fieldErrors.email}</p>}

          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && <p className="error">{fieldErrors.password}</p>}

          <label htmlFor="passwordConfirm">Bekräfta lösenord</label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Bekräfta lösenord"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          {fieldErrors.passwordConfirm && <p className="error">{fieldErrors.passwordConfirm}</p>}

          <button type="submit">Registrera dig</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
