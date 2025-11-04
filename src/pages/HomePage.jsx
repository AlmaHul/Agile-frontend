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

  // Hämta inloggad användare
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}auth/me`);
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          setError("Kunde inte ladda användardata");
        }
      } catch {
        setError("Nätverksfel vid hämtning av användardata");
      } finally {
        setLoading(false);
      }
    };
    if (user && isLoggedIn) fetchUserData();
    else setLoading(false);
  }, [user, isLoggedIn]);

  // Hämta avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;
      try {
        const res = await fetchWithAuth(`${API_URL}avatar/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setAvatar(data);
        } else if (res.status === 404) setAvatar(null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAvatar(false);
      }
    };
    if (user) fetchAvatar();
  }, [user]);

  // Hämta utmaningar
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
          start: c.start_at ? c.start_at.split("T")[0] : "",
          end: c.deadline_at ? c.deadline_at.split("T")[0] : "",
          host: c.host?.username || c.host?.email || "Okänd värd",
          host_id: c.host?.id,
          participants: c.participants?.map((p) => ({
            id: p.id,
            username: p.username || p.email,
            status: p.status,
            result: p.result,
            score: p.score ?? 0
          })) || [],
        }));
        setActiveChallenges(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChallenges(false);
    }
  };

  useEffect(() => { if (user) fetchChallenges(); }, [user]);

  // Navigering
  const handleCreateChallenge = () => navigate("/create-challenge");
  const handleCreateAvatar = () => navigate("/create-avatar");
  const handleUpdateAvatar = () => navigate("/update-avatar");

  const handleMarkDone = async (challengeId, targetUserId = null) => {
    const userIdToUpdate = targetUserId || user?.id;
    try {
      const res = await fetchWithAuth(
        `${API_URL}challenge/${challengeId}/complete${targetUserId ? `?user_id=${targetUserId}` : ''}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Misslyckades att markera som klar");
      setActiveChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, participants: c.participants.map(p => p.id === Number(userIdToUpdate) ? { ...p, result: "done", status: "joined" } : p) }
            : c
        )
      );
    } catch (err) { alert(err.message); }
  };

  const handleMarkDidNotPass = async (challengeId, targetUserId = null) => {
    const userIdToUpdate = targetUserId || user?.id;
    try {
      const res = await fetchWithAuth(
        `${API_URL}challenge/${challengeId}/did_not_pass${targetUserId ? `?user_id=${targetUserId}` : ''}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Misslyckades att markera som ej klar");
      setActiveChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, participants: c.participants.map(p => p.id === Number(userIdToUpdate) ? { ...p, result: "did_not_pass", status: "joined" } : p) }
            : c
        )
      );
    } catch (err) { alert(err.message); }
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm("Är du säker på att du vill radera denna utmaning?")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Misslyckades att radera utmaning");
      setActiveChallenges(prev => prev.filter((c) => c.id !== id));
      alert("Utmaningen raderades ✅");
    } catch (err) { alert(err.message); }
  };

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

  if (loading) return <div className="home-page"><div className="loading">Laddar...</div></div>;
  if (error) return <div className="home-page"><div className="error-message"><h2>Ett fel uppstod</h2><p>{error}</p><button onClick={() => window.location.reload()} className="avatar-btn">Försök igen</button></div></div>;
  if (!user || !isLoggedIn) return <div className="home-page"><div className="not-logged-in"><h2>Du är inte inloggad</h2><button onClick={() => navigate('/login')} className="avatar-btn">Logga in</button></div></div>;

  return (
    <div className="home-page">
      <section className="welcome">
        <h1>
          Hej {((userData?.username || user?.username || "Gäst").length > 10
            ? (userData?.username || user?.username).slice(0, 10) + "…"
            : userData?.username || user?.username || "Gäst")}! 👋
        </h1>
      </section>

      <section className="avatar">
        {loadingAvatar ? <p>Laddar avatar...</p> : avatar ? (
          <div className="avatar-container">
            <img src={getAvatarUrl(avatar)} alt="Din avatar" style={{ width: "150px", height: "150px" }} />
            <button className="avatar-btn" onClick={handleUpdateAvatar} style={{ marginTop: "10px" }}>Uppdatera Avatar</button>
          </div>
        ) : <button onClick={handleCreateAvatar}>Skapa din avatar</button>}
      </section>

      <section className="active-challenges">
        <h2>Aktiva utmaningar 🔥</h2>
        {loadingChallenges ? <p>Laddar utmaningar...</p> :
        activeChallenges.length === 0 ? <p>Inga aktiva utmaningar just nu</p> :
        <table className="challenges-table">
          <thead>
            <tr>
              <th>Challenge</th>
              <th>Status</th>
              <th>Start</th>
              <th>Mål</th>
              <th>Värd</th>
              <th>Deltagare & Poäng</th>
              <th>Information</th>
              <th>Åtgärd</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {activeChallenges.map((c) => (
              <tr key={c.id}>
                <td data-label="Challenge">{c.title}</td>
                <td data-label="Status">{formatResult(c.participants.find(p => p.id === Number(user?.id))?.result)}</td>
                <td data-label="Start">{c.start}</td>
                <td data-label="Mål">{c.end}</td>
                <td data-label="Värd">{c.host}</td>
                <td data-label="Deltagare & Poäng">
  <details className="participants-dropdown">
    <summary>Visa deltagare ({c.participants.length})</summary>
    <div className="participants-list">
      {c.participants.map((p) => (
        <div key={p.id} className="participant-item">
          <span className="participant-name">
            {p.username.length > 8 ? p.username.slice(0, 8) + ".." : p.username}
          </span>
          <span className="participant-score">{p.score ?? 0}</span>
        </div>
      ))}
    </div>
  </details>
</td>

                <td data-label="Information">
  <span>{c.description || "Ingen beskrivning"}</span>
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
                      <button className="avatar-btn" onClick={() => handleDeleteChallenge(c.id)}>
                        <img src={deleteIcon} alt="Ta bort" width={20} />
                      </button>
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
        </table>}
      </section>

      <section className="create-challenge">
        <button className="avatar-btn" onClick={handleCreateChallenge}>➕ Skapa ny utmaning</button>
      </section>
    </div>
  );
};

export default HomePage;
