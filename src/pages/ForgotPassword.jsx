



import { useState } from "react";
import { API_URL } from "../utils/api";
import "../css/Forms.css";
import logo from "../assets/images/JöraLogo.png"; // importera loggan

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Ett fel uppstod");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <img src={logo} alt="Jöra logo" className="logo" /> {/* logga här */}
        <h1>Glömt lösenord</h1>
        <form onSubmit={handleSubmit}>
          <label>Ange din e-postadress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Skicka återställningslänk</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
