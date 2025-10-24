import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";
import ChallengeParticipants from "../components/ChallengeParticipants";

const AllChallengesPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------
  // Hämta ALLA challenges
  // ---------------------------
  const fetchAllChallenges = async () => {
    if (!user?.id) return;

    setLoadingChallenges(true);
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/all`);
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
            status: p.status
          })) || [],
        }));
        setActiveChallenges(mapped);
      } else {
        setError(`Kunde inte hämta challenges: ${res.status}`);
      }
    } catch (err) {
      setError(`Fel vid hämtning av challenges: ${err.message}`);
    } finally {
      setLoadingChallenges(false);
    }
  };

  useEffect(() => {
    fetchAllChallenges();
  }, []);

  // ---------------------------
// Gå med / Gå ur challenge
// ---------------------------
const handleToggleParticipation = async (challengeId, isJoined) => {
  try {
    const url = `${API_URL}challenge/${challengeId}/${isJoined ? "leave" : "join"}`;
    const res = await fetchWithAuth(url, {
      method: "POST",
    });

    if (res.ok) {
      // Uppdatera listan med challenges
      fetchAllChallenges();
    } else {
      const data = await res.json();
      alert(data.error || "Kunde inte uppdatera deltagande");
    }
  } catch (err) {
    console.error("Fel vid uppdatering av deltagande:", err);
    alert("Fel vid uppdatering av deltagande");
  }
};


  // ---------------------------
  // Rendering
  // ---------------------------
  if (loadingChallenges) {
    return (
      <div className="home-page">
        <div className="loading">Laddar challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-message">
          <h2>Ett fel uppstod</h2>
          <p>{error}</p>
          <button onClick={() => fetchAllChallenges()} className="avatar-btn">
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

  return (
    <div className="all-challenges-page">
      <section className="active-challenges">
        <h2>Alla utmaningar 🔥</h2>
        {activeChallenges.length === 0 ? (
          <p>Inga utmaningar just nu</p>
        ) : (
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Start</th>
                <th>Deadline</th>
                <th>Värd</th>
                <th>Deltagare</th>
                <th>Beskrivning</th>
                <th>Gå med</th>
              </tr>
            </thead>
            <tbody>
              {activeChallenges.map((c) => (
                <tr key={c.id}>
                  <td data-label="Challenge">{c.title}</td>
                  <td data-label="Start">{c.start}</td>
                  <td data-label="Mål">{c.end}</td>
                  <td data-label="Värd">{c.host}</td>
                  <td data-label="Deltagare">
  <ChallengeParticipants
    challengeId={c.id}
    participants={c.participants}
  />
</td>
                 <td data-label="Information"  style={{ maxWidth: "200px" }}>{c.description || "Ingen beskrivning"}</td>
                  <td>
  {c.host_id === user.id ? (
    <button disabled className="avatar-btn">Host</button>
  ) : (
    <button
      className="avatar-btn"
      onClick={() =>
        handleToggleParticipation(
          c.id,
          c.participants.some((p) => Number(p.id) === Number(user.id))
        )
      }
    >
      {c.participants.some((p) => Number(p.id) === Number(user.id)) ? "Gå ur" : "Gå med"}
    </button>
  )}
</td>


                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AllChallengesPage;
