import React, { createContext, useContext, useState, useEffect } from "react";
import { saveTokens, removeTokens, getAccessToken, decodeToken } from "./authService";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();


  const [user, setUser] = useState(() => {
    const token = getAccessToken();
    if (!token) return null;

    const payload = decodeToken(token);
    return payload?.sub ? { id: payload.sub } : null;
  });

  const login = (accessToken, refreshToken) => {
    saveTokens(accessToken, refreshToken);
    const payload = decodeToken(accessToken);
    setUser({ id: payload.sub });
  };

  const logout = () => {
    removeTokens();
    setUser(null);
    navigate("/", { replace: true });
  };

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleStorageChange = () => {
      const token = getAccessToken();
      if (!token) return setUser(null);
      const payload = decodeToken(token);
      setUser(payload?.sub ? { id: payload.sub } : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
