import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import logo from "../assets/images/JöraLogo.png";
import "../css/Forms.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <img src={logo} alt="Jöra logo" className="logo-small" />

      <div className="header-buttons">
        {/* Home-knappen visas alltid, utom på "/" */}
        {location.pathname !== "/" && (
          <button onClick={() => navigate("/")}>Home</button>
        )}

        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>Logga in</button>
            <button onClick={() => navigate("/register")}>Registrera</button>
          </>
        ) : (
          <>
            <button onClick={logout}>Logga ut</button>
            {/* Profilknappen navigerar till /home */}
            <button
              className="profile-btn"
              onClick={() => navigate("/home")}
            ></button>
          </>
        )}
      </div>
    </header>
  );
}






