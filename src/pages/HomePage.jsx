import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import deleteIcon from "../assets/icons/delete.png";
import updateIcon from "../assets/icons/update.png";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";
import ChallengeParticipants from "../components/ChallengeParticipants";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [invitations, setInvitations] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [stats, setStats] = useState({ completed: 7, active: 3 });
  
  // Lägg till error states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // User Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ---------------------------
  // Hämta inloggad användare med felhantering
  // ---------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data from:", `${API_URL}auth/me`);
        const res = await fetchWithAuth(`${API_URL}auth/me`);
        console.log("User data response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("User data received:", data);
          setUserData(data);
        } else {
          const errorText = await res.text();
          console.error("Kunde inte hämta användardata:", res.status, errorText);
          setError("Kunde inte ladda användardata");
        }
      } catch (err) {
        console.error("Fel vid hämtning av användardata:", err);
        setError("Nätverksfel vid hämtning av användardata");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && isLoggedIn) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, isLoggedIn]);

  // ---------------------------
  // Hämta avatar
  // ---------------------------
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;
      try {
        const res = await fetchWithAuth(`${API_URL}avatar/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setAvatar(data);
        } else if (res.status === 404) {
          setAvatar(null);
        } else {
          console.error("Fel vid hämtning av avatar:", res.status);
        }
      } catch (err) {
        console.error("Fel vid hämtning av avatar:", err);
      } finally {
        setLoadingAvatar(false);
      }
    };
    
    if (user) {
      fetchAvatar();
    }
  }, [user]);

  // ---------------------------
  // Hämta aktiva utmaningar
  // ---------------------------
  const fetchChallenges = async () => {
    if (!user?.id) return;

    setLoadingChallenges(true);
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/challenges`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          status: c.score === null ? "active" : "done",
          start: c.start_at ? c.start_at.split("T")[0] : "",
          end: c.deadline_at ? c.deadline_at.split("T")[0] : "",
          host: c.host?.username || c.host?.email || "Okänd värd",
          host_id: c.host?.id,
          participants: c.participants?.map((p) => ({
            id: p.id,
            username: p.username || p.email,
            status: p.status
          })) || [],
        }));
        setActiveChallenges(mapped);
      } else {
        console.error("Kunde inte hämta challenges:", res.status);
      }
    } catch (err) {
      console.error("Fel vid hämtning av challenges:", err);
    } finally {
      setLoadingChallenges(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChallenges();
    }
  }, [user]);

  // ---------------------------
  // Hämta inbjudningar
  // ---------------------------
  useEffect(() => {
    const fetchInvites = async () => {
      if (!user?.id) return;

      setLoadingInvites(true);
      try {
        const res = await fetchWithAuth(`${API_URL}challenge/invites/me`);
        if (res.ok) {
          const data = await res.json();
          setInvitations(data);
        } else {
          console.error("Kunde inte hämta inbjudningar:", res.status);
        }
      } catch (err) {
        console.error("Fel vid hämtning av inbjudningar:", err);
      } finally {
        setLoadingInvites(false);
      }
    };
    
    if (user) {
      fetchInvites();
    }
  }, [user]);

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
      if (!e.target.closest('.user-search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // ---------------------------
  // Navigering
  // ---------------------------
  const handleCreateChallenge = () => navigate("/create-challenge");
  const handleCreateAvatar = () => navigate("/create-avatar");
  const handleUpdateAvatar = () => navigate("/update-avatar");



  const handleComplete = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/challenges/${id}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to complete challenge");
      }
      await res.json();
      setActiveChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "done" } : c))
      );
    } catch (err) {
      alert("Misslyckades att markera som klar: " + err.message);
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm("Är du säker på att du vill radera denna utmaning?")) return;

    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Misslyckades att radera utmaning");
      }

      setActiveChallenges((prev) => prev.filter((c) => c.id !== id));
      alert("Utmaningen raderades ✅");
    } catch (err) {
      alert(err.message);
    }
  };


  // ---------------------------
  // Avatar URL
  // ---------------------------
  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    const params = new URLSearchParams({
      topType: avatar.top_type,
      accessoriesType: avatar.accessories_type,
      hairColor: avatar.hair_color,
      facialHairType: avatar.facial_hair_type,
      clotheType: avatar.clothe_type,
      clotheColor: avatar.clothe_color,
      eyeType: avatar.eye_type,
      eyebrowType: avatar.eyebrow_type,
      mouthType: avatar.mouth_type,
      skinColor: avatar.skin_color,
    });
    return `https://avataaars.io/?${params.toString()}`;
  };

  // ---------------------------
  // Loading och Error States
  // ---------------------------
  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Laddar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-message">
          <h2>Ett fel uppstod</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="avatar-btn">
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  if (!user || !isLoggedIn) {
    return (
      <div className="home-page">
        <div className="not-logged-in">
          <h2>Du är inte inloggad</h2>
          <button onClick={() => navigate('/login')} className="avatar-btn">
            Logga in
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------
  // Main Render
  // ---------------------------
  return (
    <div className="home-page">
      {/* Välkomstsektion med sökfält */}
      <section className="welcome">
        <h1>Hej {userData?.username || user?.username || "Gäst"}! 👋</h1>
        
        {/* User Search Section */}
        <div className="user-search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Sök efter användare..."
              value={searchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="search-input"
            />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="search-clear-btn"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sökresultat Dropdown */}
          {showSearchResults && (
            <div className="search-results-dropdown">
              {isSearching ? (
                <div className="search-loading">Söker...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="search-result-item"
                    onClick={() => {
                      console.log('Selected user:', user);
                      alert(`Vald användare: ${user.username} (ID: ${user.id})`);
                      clearSearch();
                    }}
                  >
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="username">{user.username}</span>
                  </div>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="search-no-results">
                  Inga användare hittades
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {/* Avatar */}
      <section className="avatar">
        {loadingAvatar ? (
          <p>Laddar avatar...</p>
        ) : avatar ? (
          <div className="avatar-container">
            <img
              src={getAvatarUrl(avatar)}
              alt="Din avatar"
              style={{ width: "150px", height: "150px" }}
            />
            <button className="avatar-btn" onClick={handleUpdateAvatar} style={{ marginTop: "10px" }}>
              Uppdatera Avatar
            </button>
          </div>
        ) : (
          <button onClick={handleCreateAvatar}>Skapa din avatar</button>
        )}
      </section>

      {/* Aktiva utmaningar */}
      <section className="active-challenges">
        <h2>Aktiva utmaningar 🔥</h2>
        {loadingChallenges ? (
          <p>Laddar utmaningar...</p>
        ) : activeChallenges.length === 0 ? (
          <p>Inga aktiva utmaningar just nu</p>
        ) : (
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Status</th>
                <th>Start</th>
                <th>Mål</th>
                <th>Värd</th>
                <th>Deltagare</th>
                <th>Information</th>
                <th>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
  {activeChallenges.map((c) => (
    <tr key={c.id}>
      <td data-label="Challenge">{c.title}</td>
      <td data-label="Status">{c.status === "active" ? "🔥 Aktiv" : "✅ Klar"}</td>
      <td data-label="Start">{c.start}</td>
      <td data-label="Mål">{c.end}</td>
      <td data-label="Värd">{c.host}</td>
      <td data-label="Deltagare">
        <ChallengeParticipants
          challengeId={c.id}
          participants={c.participants}
        />
      </td>
      <td data-label="Information" style={{ maxWidth: "200px" }}>
        {c.description || "Ingen beskrivning"}
      </td>
      <td data-label="Åtgärd">
        {c.status === "active" ? (
          <button className="avatar-btn" onClick={() => handleComplete(c.id)}>
            Markera som klar
          </button>
        ) : (
          <span style={{ color: "green" }}>Klar ✅</span>
        )}
      </td>
      <td data-label="Admin">
        {c.host_id === Number(user?.id) && (
          <div style={{ display: "flex", gap: "5px" }}>
            <button className="avatar-btn" onClick={() => handleDeleteChallenge(c.id)}>
              <img src={deleteIcon} alt="Ta bort" width={20} />
            </button>
            <button className="avatar-btn" onClick={() => navigate(`/update-challenge/${c.id}`)}>
              <img src={updateIcon} alt="Uppdatera" width={20} />
            </button>
          </div>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </section>



      {/* Skapa ny utmaning */}
      <section className="create-challenge">
        <button className="avatar-btn" onClick={handleCreateChallenge}>➕ Skapa ny utmaning</button>
      </section>
    </div>
  );
};

export default HomePage;