// Header.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import logo from "../assets/images/JöraLogo.png";
import "../css/Forms.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // antag att useAuth har user och logout

  return (
    <header className="header">
      <img src={logo} alt="Jöra logo" className="logo-small" />

      <div className="header-buttons">
        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>Logga in</button>
            <button onClick={() => navigate("/register")}>Registrera</button>
          </>
        ) : (
          <button onClick={logout}>Logga ut</button>
        )}
      </div>
    </header>
  );
}

