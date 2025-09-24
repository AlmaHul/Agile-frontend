import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { saveTokens, getAccessToken, removeTokens } from './auth/authService'; // Ändra här: använd getAccessToken istället för getToken



function App() {
  const [token, setToken] = useState(getAccessToken());
  const location = useLocation();

  // Uppdatera token när det ändras i localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getAccessToken()); // Uppdatera till getAccessToken här
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Funktion för att logga in och spara token
  const login = (token) => {
    saveTokens(token); // Använd saveTokens för att spara både access och refresh token
    setToken(token); // Uppdatera state direkt
  };

  // Funktion för att logga ut
  const logout = () => {
    removeTokens();
    setToken(null);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;