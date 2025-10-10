import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../css/Forms.css";
import logo from "../assets/images/JöraLogo.png";
import { getAuthHeaders } from "../auth/authService";
import { useAuth } from "../auth/AuthProvider";

/**
 * Konverterar lokalt datum + tid till UTC ISO-format (vänligt för backend)
 */
function toUTCISO(dateStr, timeStr) {
  const t = timeStr || "09:00";
  const local = new Date(`${dateStr}T${t}`);
  const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return utc.toISOString().replace(/\.\d{3}Z$/, "Z");
}

const CreateChallengePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth(); // user = { id: '5' }

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [invites, setInvites] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /**
   * Enkelt valideringssteg innan skickning
   */
  function validate() {
    if (!title.trim()) return "Titel krävs";
    if (!startDate) return "Startdatum krävs";
    if (!duration || Number(duration) <= 0) return "Varaktighet måste vara > 0";
    return "";
  }

  /**
   * Hantera form-submission och skapa challenge via API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError("");
    setSubmitting(true);

    const inviteEmails = invites
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const startIso = startDate ? toUTCISO(startDate, startTime) : undefined;

    const deadlineIso =
      startIso && duration
        ? new Date(
            new Date(startIso).getTime() + Number(duration) * 86400000
          )
            .toISOString()
            .replace(/\.\d{3}Z$/, "Z")
        : undefined;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      start_at: startIso,
      deadline_at: deadlineIso,
      invite_emails: inviteEmails.length ? inviteEmails : undefined,
    };

    try {
      const res = await fetch(`${API_URL}challenge/challenges`, {
  method: "POST",
  headers: {
    ...getAuthHeaders(),
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload),
});


      if (res.ok) {
        setSuccess("Utmaningen skapades!");
        setTimeout(() => navigate("/profile", { replace: true }), 1200);
      } else {
        const errData = await res.json();
        setError(errData.error || "Misslyckades att skapa utmaning.");
      }
    } catch {
      setError("Ett fel uppstod. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <img src={logo} alt="Jöra logo" className="logo" />

        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <h1>Skapa utmaning</h1>

          <label htmlFor="title">Titel</label>
          <input
            id="title"
            type="text"
            placeholder="Ex. Spring 5 km"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="desc">Beskrivning</label>
          <input
            id="desc"
            type="text"
            placeholder="Beskriv din utmaning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="invite">Bjud in (e-post, separerade med kommatecken)</label>
          <input
            id="invite"
            type="text"
            placeholder="vän@site.com, kollega@site.com"
            value={invites}
            onChange={(e) => setInvites(e.target.value)}
          />

          <label>Startdatum och tid</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <label htmlFor="duration">Varaktighet (dagar)</label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ex. 7"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Skapar…" : "Skapa utmaning"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChallengePage;
