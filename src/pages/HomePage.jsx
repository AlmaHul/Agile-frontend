import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";


const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [userData, setUserData] = useState(null);

  // Avatar
  const [avatar, setAvatar] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  // Challenges
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);

  // Invitations
  const [invitations, setInvitations] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(true);

  // Stats (dummy)
  const [stats, setStats] = useState({ completed: 7, active: 3 });

  // ---------------------------
  // Hämta inloggad användare
  // ---------------------------
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
    fetchAvatar();
  }, [user]);

  // ---------------------------
  // Hämta aktiva utmaningar
  // ---------------------------
  useEffect(() => {
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
    fetchChallenges();
  }, [user]);

  // ---------------------------
  // Hämta inbjudningar
  // ---------------------------
  useEffect(() => {
    const fetchInvites = async () => {
      if (!user?.id) return;

      setLoadingInvites(true);
      try {
        const res = await fetchWithAuth(`${API_URL}challenge/challenges/invites/me`);
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
    fetchInvites();
  }, [user]);

  // ---------------------------
  // Navigering
  // ---------------------------
  const handleCreateChallenge = () => navigate("/create-challenge");
  const handleCreateAvatar = () => navigate("/create-avatar");
  const handleUpdateAvatar = () => navigate("/update-avatar");

  const handleAcceptInvite = (id) => alert(`Accepterade inbjudan ${id}`);
  const handleDeclineInvite = (id) => alert(`Nekade inbjudan ${id}`);


// Markera som klar
const handleComplete = async (id) => {
  try {
    const res = await fetchWithAuth(`${API_URL}challenge/challenges/${id}/complete`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to complete challenge");
    }
    await res.json(); // { message, challenge } om du vill använda det

    // Uppdatera UI
    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "done" } : c))
    );
  } catch (err) {
    alert("Misslyckades att markera som klar: " + err.message);
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
          <th>Information</th>
          <th>Åtgärd</th>
        </tr>
      </thead>
      <tbody>
        {activeChallenges.map((c) => (
          <tr key={c.id}>
            <td>{c.title}</td>
            <td>{c.status === "active" ? "🔥 Aktiv" : "✅ Klar"}</td>
            <td>{c.start}</td>
            <td>{c.end}</td>
            <td>{c.description || "Ingen beskrivning"}</td>
            <td>
              {c.status === "active" ? (
                <button className="avatar-btn" onClick={() => handleComplete(c.id)}>
                  Markera som klar
                </button>
              ) : (
                <span style={{ color: "green" }}>Klar ✅</span>
              )}
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
        {loadingInvites ? (
          <p>Laddar inbjudningar...</p>
        ) : invitations.length === 0 ? (
          <p>Inga nya inbjudningar</p>
        ) : (
          invitations.map((invite) => (
            <div key={invite.id} className="invite-card">
              <p>
                {invite.inviter_email} har utmanat dig: <strong>{invite.challenge_title}</strong>
              </p>
              <button className="avatar-btn" onClick={() => handleAcceptInvite(invite.id)}>Acceptera</button>
              <button className="avatar-btn" onClick={() => handleDeclineInvite(invite.id)}>Neka</button>
            </div>
          ))
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




