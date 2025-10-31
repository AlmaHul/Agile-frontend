import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import { API_URL } from "../utils/api";
import { useAuth } from "../auth/AuthProvider";
import { fetchWithAuth } from "../auth/authService";

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------
  // Hämta användardata
  // ---------------------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Hämta användarinformation
        const userRes = await fetchWithAuth(`${API_URL}auth/users/${userId}`);
        if (!userRes.ok) {
          throw new Error("Användare hittades inte");
        }
        const userData = await userRes.json();
        setUserData(userData.user);

        // Hämta avatar
        const avatarRes = await fetchWithAuth(`${API_URL}auth/users/${userId}/avatar`);
        if (avatarRes.ok) {
          const avatarData = await avatarRes.json();
          setAvatar(avatarData.avatar);
        }

        // Hämta utmaningar
        const challengesRes = await fetchWithAuth(`${API_URL}challenge/users/${userId}/challenges`);
        if (challengesRes.ok) {
          const payload = await challengesRes.json();
          // Stötta både: [{...}, {...}] och { challenges: [...] }
          const list = Array.isArray(payload) ? payload : (payload.challenges ?? []);
          setChallenges(list);
        }


      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

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
        <div className="loading">Laddar användarprofil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-message">
          <h2>Ett fel uppstod</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="avatar-btn">
            Tillbaka till startsidan
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="home-page">
        <div className="error-message">
          <h2>Användare hittades inte</h2>
          <button onClick={() => navigate('/')} className="avatar-btn">
            Tillbaka till startsidan
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === parseInt(userId);

const labelFor = (row) => {
  if (row.participant_result === "done") return "✅ Klar";
  if (row.participant_result === "failed" || row.participant_result === "did_not_pass")
    return "❌ Klarade inte";
  if (row.participant_status === "joined") return "🔥 Aktiv";
  return "🔥 Aktiv";
};




  return (
    <div className="home-page">
      {/* Profil header */}
      <section className="welcome">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
          {avatar && (
            <img
              src={getAvatarUrl(avatar)}
              alt={`${userData.username}s avatar`}
              style={{ 
                width: "120px", 
                height: "120px",
                borderRadius: "50%",
                border: "3px solid #4a90e2"
              }}
            />
          )}
          <div>
            <h1>{userData.username}'s profil 👤</h1>
            {isOwnProfile && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Det här är din egen profil
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Användarens utmaningar */}
      <section className="active-challenges">
        <h2>{userData.username}'s utmaningar 🏆</h2>
        
        {challenges.length === 0 ? (
          <p>Inga utmaningar att visa</p>
        ) : (
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Utmaning</th>
                <th>Status</th>
                <th>Start</th>
                <th>Mål</th>
                <th>Admin</th>
                <th>Roll</th>
                <th>Poäng</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td>{challenge.title}</td>
                  <td>{labelFor(challenge)}</td>

                  <td>
                    {challenge.start_at ? new Date(challenge.start_at).toLocaleDateString('sv-SE') : '-'}
                  </td>
                  <td>
                    {challenge.deadline_at ? new Date(challenge.deadline_at).toLocaleDateString('sv-SE') : '-'}
                  </td>
                  <td>{challenge.host_username}</td>
                  <td>
                    {challenge.is_host ? (
                      <span style={{ color: '#4a90e2', fontWeight: 'bold' }}>Admin</span>
                    ) : (
                      <span style={{ color: '#666' }}>Deltagare</span>
                    )}
                  </td>
                  <td>
                    {challenge.score !== null ? challenge.score : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Tillbaka-knapp */}
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="avatar-btn"
          style={{ backgroundColor: '#666' }}
        >
          ← Tillbaka
        </button>
      </section>
    </div>
  );
};

export default UserProfilePage;