import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../auth/authService";
import { API_URL } from "../utils/api";

const ChallengeParticipants = ({ challengeId }) => {
  const [participantList, setParticipantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_URL}challenge/${challengeId}/participants`);
      if (res.ok) {
        const data = await res.json();
        setParticipantList(data.participants || []);
      } else {
        console.error("Kunde inte hämta deltagare:", res.status);
      }
    } catch (err) {
      console.error("Fel vid hämtning av deltagare:", err);
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
            minWidth: "150px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          {participantList.map((p) => (
            <div key={p.id} style={{ padding: "2px 0" }}>
              {p.username}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeParticipants;
