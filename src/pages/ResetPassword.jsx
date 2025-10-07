import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import logo from "../assets/images/JöraLogo.png"; // lägg till loggan
import "../css/Forms.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Lösenorden matchar inte");
      return;
    }

    try {
      const res = await fetch(`${API_URL}auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);

      if (res.ok) setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Ett fel uppstod");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <img src={logo} alt="Jöra logo" className="logo" /> {/* logga här */}
        <h1>Återställ lösenord</h1>
        <form onSubmit={handleSubmit}>
          <label>Ny lösenord</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Bekräfta lösenord</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Uppdatera lösenord</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

