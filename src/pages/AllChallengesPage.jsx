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

  // Hämta alla challenges
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
            user_id: p.id,
            username: p.username || p.email,
            status: p.status,
            result: p.result // ← LÄGG TILL RESULT
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

  // Gå med / gå ur
  const handleToggleParticipation = async (challengeId, isJoined) => {
    try {
      const url = `${API_URL}challenge/${challengeId}/${isJoined ? "leave" : "join"}`;
      const res = await fetchWithAuth(url, { method: "POST" });
      if (res.ok) fetchAllChallenges();
      else {
        const data = await res.json();
        alert(data.error || "Kunde inte uppdatera deltagande");
      }
    } catch (err) {
      console.error(err);
      alert("Fel vid uppdatering av deltagande");
    }
  };

  // Markera som klar
  const handleMarkDone = async (challengeId, targetUserId = null) => {
    try {
      let url = `${API_URL}challenge/${challengeId}/complete`;
      if (targetUserId) {
        url += `?user_id=${targetUserId}`;
      }
      
      const res = await fetchWithAuth(url, { method: "PATCH" });
      if (res.ok) {
        fetchAllChallenges();
      } else {
        const data = await res.json();
        alert(data.error || "Kunde inte markera som klar");
      }
    } catch (err) {
      console.error(err);
      alert("Fel vid markering som klar");
    }
  };

  // Markera som ej klar
  const handleMarkDidNotPass = async (challengeId, targetUserId = null) => {
    try {
      let url = `${API_URL}challenge/${challengeId}/did_not_pass`;
      if (targetUserId) {
        url += `?user_id=${targetUserId}`;
      }
      
      const res = await fetchWithAuth(url, { method: "PATCH" });
      if (res.ok) {
        fetchAllChallenges();
      } else {
        const data = await res.json();
        alert(data.error || "Kunde inte markera som ej klar");
      }
    } catch (err) {
      console.error(err);
      alert("Fel vid markering som ej klar");
    }
  };

  // Loading / error
  if (loadingChallenges) return <div className="loading">Laddar challenges...</div>;
  if (error) return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={fetchAllChallenges} className="avatar-btn">Försök igen</button>
    </div>
  );
  if (!user || !isLoggedIn) return (
    <div>
      <p>Du är inte inloggad</p>
      <button onClick={() => navigate('/login')} className="avatar-btn">Logga in</button>
    </div>
  );

  // Main render
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
                <th>Status</th> {/* ← NY KOLUMN */}
                <th>Beskrivning</th>
                <th>Gå med</th>
              </tr>
            </thead>
            <tbody>
              {activeChallenges.map((c) => {
                const isJoined = c.participants.some(
                  (p) => Number(p.user_id) === Number(user.id) && p.status === "joined"
                );
                const isHost = Number(c.host_id) === Number(user.id);
                
                // Hitta användarens deltagarinfo
                const userParticipant = c.participants.find(
                  p => Number(p.user_id) === Number(user.id)
                );

                return (
                  <tr key={c.id}>
                    <td data-label="Challenge">{c.title}</td>
                    <td data-label="Start">{c.start}</td>
                    <td data-label="Deadline">{c.end}</td>
                    <td data-label="Värd">{c.host}</td>
                    <td data-label="Deltagare">
                      <ChallengeParticipants 
                        challengeId={c.id} 
                        participants={c.participants}
                        isHost={isHost}
                        handleMarkDone={handleMarkDone}
                        handleMarkDidNotPass={handleMarkDidNotPass}
                      />
                    </td>
                    <td data-label="Status">
                      {/* Visa status för användaren */}
                      {isHost && (
                        <span style={{color: '#666', fontSize: '0.9rem'}}>
                          Värd
                        </span>
                      )}
                      {!isHost && userParticipant && (
                        <div>
                          {userParticipant.result === "done" && "✅ Klar"}
                          {userParticipant.result === "did_not_pass" && "❌ Ej klar"}
                          {!userParticipant.result && isJoined && "🔥 Aktiv"}
                          {!userParticipant.result && !isJoined && "❌ Ej med"}
                        </div>
                      )}
                      {!isHost && !userParticipant && (
                        <span style={{color: '#666'}}>Ej med</span>
                      )}
                    </td>
                    <td data-label="Information" style={{ maxWidth: "200px" }}>
                      {c.description || "Ingen beskrivning"}
                    </td>
                    <td>
                      {isHost ? (
                        <button disabled className="avatar-btn">Host</button>
                      ) : (
                        <button
                          className="avatar-btn"
                          onClick={() => handleToggleParticipation(c.id, isJoined)}
                        >
                          {isJoined ? "Gå ur" : "Gå med"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AllChallengesPage;