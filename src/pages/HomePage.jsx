import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import deleteIcon from "../assets/icons/delete.png";
import updateIcon from "../assets/icons/update.png";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";
import ChallengeParticipants from "../components/ChallengeParticipants";
import ParticipantActionDropdown from "../components/ParticipantActionDropdown";

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

  function formatResult(result) {
    switch (result) {
      case "done":
        return "Klar ✅";
      case "did_not_pass":
        return "Klarade inte ❌";
      case null:
      case undefined:
        return "Active 🔥";
      default:
        return "Active 🔥";
    }
  }

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
        // Temporärt inaktiverat - sätt tom lista
        console.log("Inbjudningar temporärt inaktiverade");
        setInvitations([]);
      } catch (err) {
        console.error("Fel vid hämtning av inbjudningar:", err);
        setInvitations([]);
      } finally {
        setLoadingInvites(false);
      }
    };
    
    if (user) {
      fetchInvites();
    }
  }, [user]);

  // ---------------------------
  // Navigering
  // ---------------------------
  const handleCreateChallenge = () => navigate("/create-challenge");
  const handleCreateAvatar = () => navigate("/create-avatar");
  const handleUpdateAvatar = () => navigate("/update-avatar");

  const handleMarkDone = async (challengeId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${challengeId}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Misslyckades att markera som klar");
      const data = await res.json();

      // Uppdatera state direkt
      setActiveChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? {
                ...c,
                participants: c.participants.map(p =>
                  p.id === Number(user?.id)
                    ? { ...p, result: "done", status: "joined" }
                    : p
                )
              }
            : c
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkDidNotPass = async (challengeId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${challengeId}/did_not_pass`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Misslyckades att markera som ej klar");
      const data = await res.json();

      // Uppdatera state direkt
      setActiveChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? {
                ...c,
                participants: c.participants.map(p =>
                  p.id === Number(user?.id)
                    ? { ...p, result: "did_not_pass", status: "joined" }
                    : p
                )
              }
            : c
        )
      );
    } catch (err) {
      alert(err.message);
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
      {/* Välkomstsektion UTAN sökfält */}
      <section className="welcome">
        <h1>
          Hej {((userData?.username || user?.username || "Gäst").length > 10
            ? (userData?.username || user?.username).slice(0, 10) + "…"
            : userData?.username || user?.username || "Gäst")}! 👋
        </h1>
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
                  <td data-label="Status">
                    {formatResult(c.participants.find(p => p.id === Number(user?.id))?.result)}
                  </td>
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
                    <ParticipantActionDropdown
                      participant={c.participants.find(p => p.id === Number(user?.id) && p.status === "joined")}
                      handleMarkDone={handleMarkDone}
                      handleMarkDidNotPass={handleMarkDidNotPass}
                      challengeId={c.id}
                    />
                  </td>
                  <td data-label="Admin">
                    {c.host_id === Number(user?.id) && (
                      <div style={{ display: "flex", gap: "5px" }}>
                        {/* Delete-knappen visas alltid för host */}
                        <button className="avatar-btn" onClick={() => handleDeleteChallenge(c.id)}>
                          <img src={deleteIcon} alt="Ta bort" width={20} />
                        </button>

                        {/* Update-knappen visas endast om inga deltagare finns */}
                        {c.participants.length === 0 && (
                          <button className="avatar-btn" onClick={() => navigate(`/update-challenge/${c.id}`)}>
                            <img src={updateIcon} alt="Uppdatera" width={20} />
                          </button>
                        )}
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