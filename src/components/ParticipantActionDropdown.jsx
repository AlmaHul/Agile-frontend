import React, { useState, useEffect, useRef } from "react";

const ParticipantActionDropdown = ({ participant, handleMarkDone, handleMarkDidNotPass, challengeId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

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

  if (!participant) return <span>Ingen åtgärd</span>;

  if (participant.result === "done") return <span>Klar ✅</span>;
  if (participant.result === "did_not_pass") return <span>Klarade inte ❌</span>;

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button className="avatar-btn" onClick={toggleDropdown}>...</button>
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
            minWidth: "120px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button className="avatar-btn" onClick={() => handleMarkDone(challengeId)}>
            Markera som klar
          </button>
          <button className="avatar-btn" onClick={() => handleMarkDidNotPass(challengeId)}>
            Markera som ej klar
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantActionDropdown;
