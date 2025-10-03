// LandingPage.jsx
import React, { useState } from 'react';
import '../LandingPage.css';
import { FaUsers, FaTrophy, FaChartLine, FaCheckCircle, FaArrowRight, FaShareAlt, FaStar, FaPlus } from 'react-icons/fa';

const LandingPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Tack för ditt intresse! Vi hör av oss snart.');
  };

  return (
    <div className="landing-page">
      {/* HÄR ANVÄNDER DU DIN BEFINTLIGA HEADER KOMPONENT */}
      {/* Header kommer automatiskt från din App.jsx */}

      {/* Main Content */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Side - Text Content */}
          <div className="hero-content">
            <div className="badge">
              <FaStar className="badge-icon" />
              <span>Innovativ plattform för team-utmaningar</span>
            </div>

            <h1 className="hero-title">
              Transformera mål till <span className="highlight">gemensamma äventyr</span>
            </h1>
            
            <p className="hero-description">
              JÖRA är den professionella plattformen där team och vänner skapar delade utmaningar, 
              följer framsteg i realtid och firar framgångar tillsammans. Från fitness-mål till 
              projekt-milestones - gör varje uppnått mål till en gemensam seger.
            </p>

            <div className="cta-section">
              <div className="cta-buttons">
                <a href="/register" className="btn primary">
                  Starta gratis <FaArrowRight className="btn-icon" />
                </a>
                <a href="#features" className="btn secondary">
                
                </a>
              </div>
              
              <div className="trust-indicators">
                <div className="trust-item">
                 
               
            
                
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Demo Card ONLY */}
          <div className="hero-visual">
            <div className="demo-card">
              <div className="card-header">
                <div className="card-title">
                  <h3>Team Fitness Challenge</h3>
                  <span className="card-badge">Aktiv</span>
                </div>
                <div className="card-stats">
                  <div className="stat">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Deltagare</div>
                  </div>
                </div>
              </div>
              
              <div className="progress-section">
                <div className="progress-header">
                  <span>Veckomål: 200km cykling</span>
                  <span className="progress-percent">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <div className="progress-details">
                  <span>150km avslutade</span>
                  <span>3 dagar kvar</span>
                </div>
              </div>

              <div className="tasks-list">
                <div className="task-item completed">
                  <FaCheckCircle className="task-icon" />
                  <span>Anna - 50km</span>
                </div>
                <div className="task-item completed">
                  <FaCheckCircle className="task-icon" />
                  <span>Marcus - 45km</span>
                </div>
                <div className="task-item current">
                  <div className="task-pulse"></div>
                  <span>Lisa - 40km (pågående)</span>
                </div>
                <div className="task-item pending">
                  <div className="task-circle"></div>
                  <span>David - 15km</span>
                </div>
                <div className="task-item pending">
                  <div className="task-circle"></div>
                  <span>Emma - 0km</span>
                </div>
              </div>

              <div className="card-actions">
            
                <button className="action-btn secondary">
                  
                
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Under huvudinnehållet */}
        <div id="features" className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>Skapa delade utmaningar och arbeta mot gemensamma mål med realtids-uppdateringar.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Progress Tracking</h3>
            <p>Följ framsteg med visuella dashboards och detaljerade statistiköversikter.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaTrophy />
            </div>
            <h3>Achievement System</h3>
            <p>Fira milstolpar med badges, belöningar och team-achievements.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCheckCircle />
            </div>
            <h3>Smart Reminders</h3>
            <p>Automatiska påminnelser och motivation baserat på teamets framsteg.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;