import { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";
import { API_URL } from "../utils/api";
import logo from "../assets/images/JöraLogo.png";
import "../css/Forms.css"; 
import "../css/Header.css"; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // ✅ Mobile menu state
  const [open, setOpen] = useState(false);

  // ✅ User Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ---------------------------
  // User Search Funktion
  // ---------------------------
  const handleUserSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetchWithAuth(`${API_URL}auth/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
        setShowSearchResults(true);
      } else {
        console.error("Sökning misslyckades:", res.status);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Fel vid sökning:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Stäng sökresultat när man klickar utanför
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
<header className={`header ${user ? 'logged-in' : 'logged-out'}`}>

      <img src={logo} alt="Jöra logo" className="logo-small" />

      {/* ✅ User Search i Header - visas endast när inloggad */}
      {user && (
        <div className="header-search-container">
          <div className="header-search-wrapper">
            <input
              type="text"
              placeholder="Sök användare..."
              value={searchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="header-search-input"
            />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="header-search-clear-btn"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sökresultat Dropdown */}
          {showSearchResults && (
            <div className="header-search-results">
              {isSearching ? (
                <div className="header-search-loading">Söker...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="header-search-result-item"
                    onClick={() => {
                      navigate(`/user/${user.id}`);
                      clearSearch();
                      setOpen(false);
                    }}
                  >
                    <div className="header-user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="header-username">{user.username}</span>
                  </div>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="header-search-no-results">
                  Inga användare hittades
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* ✅ Hamburger toggle (visible on mobile) */}
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
        {!user && location.pathname !== "/" && (
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