import { useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import logo from "../assets/images/JöraLogo.png";
import "../css/Forms.css"; 
import "../css/Header.css"; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ✅ NEW: track if mobile menu is open
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <img src={logo} alt="Jöra logo" className="logo-small" />

      {/*  NEW: hamburger toggle (visible on mobile) */}
      <button
        className="nav-toggle"
        aria-label="Öppna meny"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      {/* ✅ Wrap your buttons inside a nav container */}
      <div className={`header-buttons ${open ? "is-open" : ""}`}>
        {/* Home button always visible except on "/" */}
        {location.pathname !== "/" && (
          <button onClick={() => { navigate("/"); setOpen(false); }}>Home</button>
        )}

        {!user ? (
          <>
            <button onClick={() => { navigate("/login"); setOpen(false); }}>Logga in</button>
            <button onClick={() => { navigate("/register"); setOpen(false); }}>Registrera</button>
          </>
        ) : (
          <>
            <button onClick={() => { logout(); setOpen(false); }}>Logga ut</button>
            <button onClick={() => { navigate("/profile"); setOpen(false); }}>Profil</button>
            <button onClick={() => { navigate("/all-challenges"); setOpen(false); }}>Alla utmaningar</button>
          </>
        )}
      </div>
    </header>
  );
}
