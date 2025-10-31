// Footer.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #FFB347, #FFCC70)",
        padding: "12px 20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#333",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        marginTop: "auto",
      }}
    >
      <span
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => navigate("/about")}
      >
        Om oss
      </span>{" "}
      • © 2025 Jöra
    </footer>
  );
}
