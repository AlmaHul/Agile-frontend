import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../css/Forms.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) {
        setTimeout(() => navigate("/login"), 2000); // gå tillbaka till login efter 2 sek
      }
    } catch (err) {
      setMessage("Ett fel uppstod");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>Återställ lösenord</h1>
        <form onSubmit={handleSubmit}>
          <label>Ny lösenord</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Uppdatera lösenord</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

