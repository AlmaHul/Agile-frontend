// src/pages/CreateChallengePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChallenge } from "../utils/api.js"; // calls POST /api/challenges
import "../css/Forms.css";

// Convert local date+time inputs to a UTC ISO string (backend-friendly)
function toUTCISO(dateStr, timeStr) {
  const t = timeStr || "09:00";                         // default time if empty
  const local = new Date(`${dateStr}T${t}`);            // build local Date
  const utc = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return utc.toISOString().replace(/\.\d{3}Z$/, "Z");   // ISO without ms
}

export default function CreateChallengePage() {
  const nav = useNavigate();

  // Form state (controlled inputs)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");   // maps to backend 'description'
  const [invites, setInvites] = useState("");           // comma-separated emails
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  // UI state (errors + loading)
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Minimal validation to avoid obvious bad requests
  function validate() {
    if (!title.trim()) return "Title is required";
    if (!startDate) return "Start date is required";
    if (!duration || Number(duration) <= 0) return "Duration must be > 0";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setError("");
    setSubmitting(true);

    // Build the payload in the exact shape the backend expects
    const inviteEmails = invites.split(",").map(s => s.trim()).filter(Boolean);

    const startIso = startDate ? toUTCISO(startDate, startTime) : undefined;

    // deadline_at = start_at + duration (days), in UTC ISO
    const deadlineIso = (startIso && duration)
      ? new Date(new Date(startIso).getTime() + Number(duration) * 86400000)
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z")
      : undefined;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      start_at: startIso,
      deadline_at: deadlineIso,                   // 👈 skickas nu till backend
      invite_emails: inviteEmails.length ? inviteEmails : undefined,
    };

    try {
      // Real API call (includes JWT cookie via credentials: 'include' in utils/api.js)
      await createChallenge(payload);

      // On success: navigate to /home (protected area)
      nav("/home");
    } catch (err) {
      // Surface server-side error message (e.g., 400 validation error text)
      setError(err.message || "Failed to create challenge");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page" style={{ alignItems: "center", paddingTop: 32 }}>
      <form className="form-container" onSubmit={handleSubmit} style={{ width: 540 }}>
        <h1>Create Challenge</h1>

        {/* Error banner (shown when backend or validation fails) */}
        {error && <div className="error" style={{ marginBottom: 10 }}>{error}</div>}

        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex. Run 5km"
        />

        <label htmlFor="desc">Description</label>
        <input
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your challenge"
        />

        <label htmlFor="invite">Invite (emails, comma separated)</label>
        <input
          id="invite"
          value={invites}
          onChange={(e) => setInvites(e.target.value)}
          placeholder="friend@site.com, teammate@site.com"
        />

        <label>Time / Date</label>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <label htmlFor="duration">Duration (days)</label>
        <input
          id="duration"
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ex. 7"
        />

        <p style={{ fontSize: 12, color: "#001f4d", marginTop: 6 }}>
          Score: RNG 5–50 points (auto later)
        </p>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating…" : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}
