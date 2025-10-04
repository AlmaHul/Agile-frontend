// LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../LandingPage.css";
import image1 from "../assets/images/landing/image1.jpg";
import image2 from "../assets/images/landing/image2.jpg";
import image3 from "../assets/images/landing/image3.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content-centered">
          {/* Alternativ proffsigare version */}
          <h1 className="hero-title">
            Transformera era mål till gemensamma framgångar med Jöra
          </h1>
          
          <div className="features-section">
            <p className="features-title">Effektivisera ert samarbete</p>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Samarbeta sömlöst med delade projektlistor</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Öka engagemanget med interaktiva utmaningar</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Övervakning i realtid för optimal produktivitet</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Belöna och uppmärksamma era gemensamma resultat</span>
              </div>
            </div>
          </div>

          <button className="btn-primary-large" onClick={handleRegisterClick}>
            Starta er produktivitetsresa idag
          </button>

          <div className="image-gallery">
            <div className="image-container">
              <img src={image1} alt="Team samarbete i Jöra" className="landing-image" />
            </div>
            <div className="image-container">
              <img src={image2} alt="Produktivitet i Jöra" className="landing-image" />
            </div>
            <div className="image-container">
              <img src={image3} alt="Framgångsrika team i Jöra" className="landing-image" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;