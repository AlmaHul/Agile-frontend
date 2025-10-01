import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Välkommen!</h1>
      <button onClick={() => navigate("/login")} style={{ margin: "10px" }}>
        Logga in
      </button>
      <button onClick={() => navigate("/register")} style={{ margin: "10px" }}>
        Registrera
      </button>
    </div>
  );
}
