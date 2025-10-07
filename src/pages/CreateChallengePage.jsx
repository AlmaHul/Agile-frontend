import { useState } from "react";
import "../css/Forms.css"; // använd befintlig stil

export default function CreateChallengePage() {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [invites, setInvites] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Just test feedback
    setMessage(`Challenge "${title}" created (mock)!`);
  }

  return (
    <div className="form-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <form className="form-container" onSubmit={handleSubmit} style={{ width: 500 }}>
        <h1>Create Challenge</h1>

        {message && <p style={{ color: "green" }}>{message}</p>}

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
        <div style={{ display: "flex", gap: "10px" }}>
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

        <p style={{ fontSize: 12, color: "#001f4d" }}>Score: RNG 5–50 points (auto later)</p>

        <button type="submit">Create Challenge</button>
      </form>
    </div>
  );
}
