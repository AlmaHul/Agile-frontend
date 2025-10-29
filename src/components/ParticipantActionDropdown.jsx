import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";

const ParticipantActionDropdown = ({ 
  participant, 
  handleMarkDone, 
  handleMarkDidNotPass, 
  challengeId,
  isHost = false,
  targetUserId = null 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const { user } = useAuth();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  // Stäng dropdown om man klickar utanför
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Om admin hanterar en annan användare ELLER sig själv
  if (isHost) {
    const targetParticipant = participant || {};
    const currentResult = targetParticipant.result;

    return (
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
        <button 
          className="avatar-btn" 
          onClick={toggleDropdown}
          style={{ fontSize: "0.8rem", padding: "4px 8px" }}
        >
          {currentResult === "done" && "✅"}
          {currentResult === "did_not_pass" && "❌"}
          {!currentResult && "⚡"}
          ▼
        </button>
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              background: "white",
              border: "1px solid #ccc",
              padding: "5px",
              zIndex: 100,
              minWidth: "160px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              borderRadius: "5px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <button 
              className="avatar-btn" 
              onClick={() => {
                handleMarkDone(challengeId, targetUserId);
                setShowDropdown(false);
              }}
              style={{ 
                fontSize: "0.8rem",
                backgroundColor: currentResult === "done" ? "#e8f5e8" : "white"
              }}
            >
              ✅ Markera som klar
            </button>
            <button 
              className="avatar-btn" 
              onClick={() => {
                handleMarkDidNotPass(challengeId, targetUserId);
                setShowDropdown(false);
              }}
              style={{ 
                fontSize: "0.8rem",
                backgroundColor: currentResult === "did_not_pass" ? "#ffe8e8" : "white"
              }}
            >
              ❌ Markera som ej klar
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vanlig deltagare-vy (hanterar bara sig själv)
  if (!participant) return <span style={{ color: "#666", fontSize: "0.9rem" }}>Ingen åtgärd</span>;

  if (participant.result === "done") return <span>Klar ✅</span>;
  if (participant.result === "did_not_pass") return <span>Klarade inte ❌</span>;

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button className="avatar-btn" onClick={toggleDropdown}>Markera ▼</button>
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "white",
            border: "1px solid #ccc",
            padding: "5px",
            zIndex: 100,
            minWidth: "160px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <button 
            className="avatar-btn" 
            onClick={() => {
              handleMarkDone(challengeId);
              setShowDropdown(false);
            }}
          >
            ✅ Markera som klar
          </button>
          <button 
            className="avatar-btn" 
            onClick={() => {
              handleMarkDidNotPass(challengeId);
              setShowDropdown(false);
            }}
          >
            ❌ Markera som ej klar
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantActionDropdown;