import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch("/api/challenges", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch challenges");
        setChallenges(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchChallenges();
  }, []);

  return (
    <div
      style={{
        padding: "40px 0",
        minHeight: "100vh",
        backgroundColor: "#f2f6fc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Titel + knapp */}
      <div style={{ width: "90%", maxWidth: 700, marginBottom: 20 }}>
        <h1
          style={{
            marginBottom: 10,
            fontSize: 28,
            color: "#001f4d",
            borderBottom: "2px solid #ff8c00",
            display: "inline-block",
            paddingBottom: 4,
          }}
        >
          My Challenges
        </h1>

        <div style={{ textAlign: "right", marginTop: -30 }}>
          <button
            onClick={() => nav("/challenges/create")}
            style={{
              backgroundColor: "#ff8c00",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Create new
          </button>
        </div>
      </div>

      {/* Felmeddelande */}
      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#a10000",
            padding: "8px 12px",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Lista med kort */}
      <div
        style={{
          width: "90%",
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {challenges.length === 0 ? (
          <p style={{ color: "#333" }}>No challenges yet.</p>
        ) : (
          challenges.map((ch) => (
            <div
              key={ch.id}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: "#001f4d",
                }}
              >
                {ch.title}
              </h3>
              <p style={{ margin: "4px 0 8px", color: "#333" }}>
                {ch.description || "No description"}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#444" }}>
                <b>Start:</b> {new Date(ch.start_at).toLocaleString()} <br />
                <b>Deadline:</b>{" "}
                {ch.deadline_at
                  ? new Date(ch.deadline_at).toLocaleString()
                  : "N/A"}{" "}
                <br />
                <b>Score:</b>{" "}
                {ch.score !== null ? ch.score : "Not completed"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
