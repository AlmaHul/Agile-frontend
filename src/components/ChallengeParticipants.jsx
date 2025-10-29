import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../auth/authService";
import { API_URL } from "../utils/api";
import ParticipantActionDropdown from "./ParticipantActionDropdown";
import { useAuth } from "../auth/AuthProvider";

const ChallengeParticipants = ({ 
  challengeId, 
  participants = [],
  isHost = false,
  handleMarkDone,
  handleMarkDidNotPass 
}) => {
  const [participantList, setParticipantList] = useState(participants);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuth();

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${challengeId}/participants`);
      if (res.ok) {
        const data = await res.json();
        setParticipantList(data.participants || []);
      } else {
        console.error("Kunde inte hämta deltagare:", res.status);
        setParticipantList(participants);
      }
    } catch (err) {
      console.error("Fel vid hämtning av deltagare:", err);
      setParticipantList(participants);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [challengeId]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  // Stäng dropdown om man klickar utanför
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`#participants-${challengeId}`)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [challengeId]);

  if (loading) return <span>Laddar deltagare...</span>;

  return (
    <div id={`participants-${challengeId}`} style={{ position: "relative" }}>
      <span
        onClick={toggleDropdown}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        {participantList.length} deltagare
      </span>

      {showDropdown && participantList.length > 0 && (
        <div
          style={{
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            zIndex: 100,
            marginTop: "5px",
            maxHeight: "200px",
            overflowY: "auto",
            minWidth: "250px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            borderRadius: "5px"
          }}
        >
          {participantList.map((p) => (
            <div key={p.id} style={{ 
              padding: "8px 0", 
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontWeight: "bold" }}>{p.username}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {p.result === "done" && "✅ Klar"}
                  {p.result === "did_not_pass" && "❌ Ej klar"}
                  {!p.result && "🔥 Aktiv"}
                </div>
              </div>
              
              {/* Admin kan hantera alla deltagare inklusive sig själv */}
              {isHost && (
                <ParticipantActionDropdown
                  participant={p}
                  handleMarkDone={handleMarkDone}
                  handleMarkDidNotPass={handleMarkDidNotPass}
                  challengeId={challengeId}
                  isHost={isHost}
                  targetUserId={p.id}
                />
              )}
              
              {/* Vanlig användare kan bara hantera sig själv */}
              {!isHost && Number(p.id) === Number(user?.id) && (
                <ParticipantActionDropdown
                  participant={p}
                  handleMarkDone={handleMarkDone}
                  handleMarkDidNotPass={handleMarkDidNotPass}
                  challengeId={challengeId}
                  isHost={false}
                  targetUserId={null}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeParticipants;