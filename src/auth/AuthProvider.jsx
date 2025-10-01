import React, { createContext, useContext, useState, useEffect } from "react";
import { saveTokens, removeTokens, getAccessToken } from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(!!getAccessToken()); // true/false

  // Login: spara token och uppdatera user
  const login = (accessToken, refreshToken) => {
    saveTokens(accessToken, refreshToken);
    setUser(true);
  };

  // Logout: ta bort token och sätt user till null
  const logout = () => {
    removeTokens();
    setUser(false);
  };

  const isLoggedIn = !!user;

  // Håll user sync med localStorage
  useEffect(() => {
    const handleStorageChange = () => setUser(!!getAccessToken());
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



