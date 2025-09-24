import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
  console.log("🟢 useEffect körs - isLoggedIn:", isLoggedIn);
  if (isLoggedIn) {
    console.log("✅ isLoggedIn är true! Navigerar till /");
    navigate("/", { replace: true });
  }
}, [isLoggedIn, navigate]);


 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // 👇 OBS: nu skickas både access och refresh token
      login(data.access_token, data.refresh_token);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Inloggning misslyckades');
    }
  } catch (err) {
    setError('Något gick fel. Försök igen.');
  }
};

	return (
	   <div className="login">
        <h4>Logo</h4>
        <form onSubmit={handleLogin} className="login-form">
          <div className="text_area">
            <input
              type="text"
              placeholder="Användarnamn"
              value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
              className="text_input"

            />
          </div>
          <div className="text_area">
            <input
               type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
              className="text_input"

            />
          </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="btn"
          >
            Logga in
          </button>
        </form>

      </div>

	);
};
export default LoginPage;