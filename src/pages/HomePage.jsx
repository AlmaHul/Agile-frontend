import React from "react";
import { useAuth } from "../auth/AuthProvider";

const HomePage = () => {
  const { logout } = useAuth();
  return (
    <div>
      <h1>Hej!</h1>
      <button onClick={logout}>Logga ut</button>
    </div>
  );
};

export default HomePage;

