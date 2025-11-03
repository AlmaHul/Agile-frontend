import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../auth/authService";
import { API_URL } from "../utils/api";

// Lägg till denna funktion
const truncateUsername = (username, maxLength = 12) => {
  if (!username) return '';
  if (username.length <= maxLength) return username;
  return username.substring(0, maxLength) + '…';
};

/**
 * Render participants as a plain comma-separated text string.
 * Excludes the host/creator from the list (via is_host flag or matching ID/username).
 */
const ChallengeParticipants = ({
  challengeId,
  participants = [],
  hostId,           // ⬅ läggs till om backend skickar värdens ID
  hostUsername,     // ⬅ läggs till om backend skickar värdens namn
}) => {
  const [participantList, setParticipantList] = useState(participants);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <span>Laddar deltagare...</span>;

  // 🧠 Filtrera bort värden ur listan (oavsett flagga eller id/namn-match)
  const names = (participantList || [])
    .filter((p) => {
      if (p.is_host) return false; // tydlig hostflagga
      if (hostId && String(p.id) === String(hostId)) return false; // samma id som värden
      if (hostUsername && p.username === hostUsername) return false; // samma namn som värden
      return true;
    })
    .map((p) => truncateUsername(p?.username)) // ← APPLY TRUNCATE HERE
    .filter(Boolean);

  return (
    <div id={`participants-${challengeId}`}>
      {names.length === 0 ? <span>Inga deltagare</span> : <span>{names.join(", ")}</span>}
    </div>
  );
};

export default ChallengeParticipants;