import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../auth/authService";
import { API_URL } from "../utils/api";

const ChallengeParticipants = ({ challengeId, participants }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [participantList, setParticipantList] = useState(participants || []);

  const toggleDropdown = async () => {
    if (!showDropdown && participantList.length === 0) {
      try {
        const res = await fetchWithAuth(`${API_URL}challenge/${challengeId}/participants`);
        if (res.ok) {
          const data = await res.json();
          setParticipantList(data.participants);
        }
      } catch (err) {
        console.error("Fel vid hämtning av deltagare:", err);
      }
    }
    setShowDropdown(!showDropdown);
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
          }}
        >
          {participantList.map((p) => (
            <div key={p.id}>
              {p.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeParticipants;