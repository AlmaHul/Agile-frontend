import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); // user = { id: '5' }

  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);



  const [activeChallenges, setActiveChallenges] = useState([
    { id: 1, title: "Gå 10 000 steg", status: "active", start: "2025-10-07", end: "2025-10-10" },
    { id: 2, title: "Drick 2L vatten", status: "done", start: "2025-10-06", end: "2025-10-09" },
  ]);

  const [invitations, setInvitations] = useState([
    { id: 1, from: "Jane Doe", title: "Gå 10 000 steg" },
  ]);

  const [stats, setStats] = useState({ completed: 7, active: 3 });

  // ✅ Hämta info om inloggad användare
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}auth/me`);
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          console.error("Kunde inte hämta användardata:", res.status);
        }
      } catch (err) {
        console.error("Fel vid hämtning av användardata:", err);
      }
    };

    fetchUserData();
  }, []);

  // Fetch avatar när komponenten mountas
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user?.id) return;

      try {
        const res = await fetchWithAuth(`${API_URL}avatar/${user.id}`);

        if (res.ok) {
          const data = await res.json();
          setAvatar(data);
        } else if (res.status === 404) {
          setAvatar(null); // ingen avatar skapad
        } else if (res.status === 401) {
          console.error("Unauthorized: token saknas eller ogiltig");
        } else {
          console.error("Fel vid hämtning av avatar:", res.status, res.statusText);
        }
      } catch (err) {
        console.error("Fel vid hämtning av avatar:", err);
      } finally {
        setLoadingAvatar(false);
      }
    };

    fetchAvatar();
  }, [user]);

  const handleCreateChallenge = () => navigate("/create-challenge");
  const handleCreateAvatar = () => navigate("/create-avatar");
  const handleUpdateAvatar = () => navigate("/update-avatar");

  const handleAcceptInvite = (id) => alert(`Accepted invite ${id}`);
  const handleDeclineInvite = (id) => alert(`Declined invite ${id}`);

  // Generera avataaars URL
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

  return (
    <div className="home-page">
      {/* Välkomstsektion */}
      <section className="welcome">
        <h1>Hej {userData?.username || "Gäst"}! 👋</h1>
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
        {activeChallenges.length === 0 ? (
          <p>Inga aktiva utmaningar just nu</p>
        ) : (
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Status</th>
                <th>Start</th>
                <th>Mål</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              {activeChallenges.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>
                    {c.status === "active" && "🔥 Aktiv"}
                    {c.status === "pending" && "⏳ Pågår"}
                    {c.status === "done" && "✅ Klar"}
                    {c.status === "declined" && "❌ Nekad"}
                  </td>
                  <td>{c.start}</td>
                  <td>{c.end}</td>
                  <td>
                    <button onClick={() => alert(`Visa challenge ${c.id}`)}>Visa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Inbjudningar */}
      <section className="invitations">
        <h2>Inbjudningar 📩</h2>
        {invitations.length === 0 && <p>Inga nya inbjudningar</p>}
        {invitations.map((invite) => (
          <div key={invite.id} className="invite-card">
            <p>
              {invite.from} har utmanat dig: <strong>{invite.title}</strong>
            </p>
            <button className="avatar-btn" onClick={() => handleAcceptInvite(invite.id)}>Acceptera</button>
            <button className="avatar-btn" onClick={() => handleDeclineInvite(invite.id)}>Neka</button>
          </div>
        ))}
      </section>

      {/* Skapa ny utmaning */}
      <section className="create-challenge">
        <button className="avatar-btn" onClick={handleCreateChallenge}>➕ Skapa ny utmaning</button>
      </section>

      {/* Statistik */}
      <section className="stats">
        <h2>Din statistik 🏅</h2>
        <p>Klara utmaningar: {stats.completed}</p>
        <p>Aktiva utmaningar: {stats.active}</p>
      </section>
    </div>
  );
};

export default HomePage;



