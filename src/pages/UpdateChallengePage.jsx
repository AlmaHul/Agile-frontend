import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../css/Forms.css";
import logo from "../assets/images/JöraLogo.png";
import { getAuthHeaders } from "../auth/authService";
import { useAuth } from "../auth/AuthProvider";

function toUTCISO(dateStr, timeStr) {
  const t = timeStr || "09:00";
  const local = new Date(`${dateStr}T${t}`);
  const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return utc.toISOString().replace(/\.\d{3}Z$/, "Z");
}

const UpdateChallengePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { challengeId } = useParams();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [invites, setInvites] = useState(""); // e-post för nya invites
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  // Deltagare (email + status)
  const [participants, setParticipants] = useState([]);

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------
  // Hämta befintlig challenge
  // ---------------------------
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch(`${API_URL}challenge/challenges/${challengeId}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Misslyckades hämta challenge");
        const data = await res.json();

        // Form values
        setTitle(data.title || "");
        setDescription(data.description || "");
        setStartDate(data.start_at?.split("T")[0] || "");
        setStartTime(data.start_at?.split("T")[1]?.slice(0, 5) || "");

        if (data.deadline_at && data.start_at) {
          const diff = new Date(data.deadline_at) - new Date(data.start_at);
          setDuration(Math.ceil(diff / 86400000));
        }

        // Deltagare
        setParticipants(data.participants || []);

        // Pre-fyll invites med alla e-post som pending/active
        setInvites(
          (data.participants || [])
            .filter(p => p.status === "pending") // exkludera accepterade om du vill
            .map(p => p.email)
            .join(", ")
        );

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  // ---------------------------
  // Submit (update) challenge
  // ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const startIso = startDate ? toUTCISO(startDate, startTime) : undefined;
    const deadlineIso = startIso && duration
      ? new Date(new Date(startIso).getTime() + Number(duration) * 86400000)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z")
      : undefined;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      start_at: startIso,
      deadline_at: deadlineIso,
      add_invites: invites
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}challenge/${challengeId}`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Misslyckades uppdatera challenge");
      }

      const updated = await res.json();

      // Uppdatera participants-listan
      setParticipants(updated.challenge.participants || []);

      setSuccess("Utmaningen uppdaterades!");
      setTimeout(() => navigate("/profile", { replace: true }), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Laddar utmaning...</p>;

  return (
    <div className="form-page">
      <div className="form-container">
        <img src={logo} alt="Jöra logo" className="logo" />

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <h1>Uppdatera utmaning</h1>

          <label htmlFor="title">Titel</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="desc">Beskrivning</label>
          <input
            id="desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Startdatum och tid</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <label htmlFor="duration">Varaktighet (dagar)</label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <label htmlFor="invites">Deltagare</label>
          <ul>
            {participants.map((p, i) => (
              <li key={i}>
                {p.email} — {p.status}
              </li>
            ))}
          </ul>

          <button type="submit" disabled={submitting}>
            {submitting ? "Uppdaterar…" : "Uppdatera utmaning"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateChallengePage;

