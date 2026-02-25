import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function WelcomePage() {
  const nav = useNavigate();
  return (
    <div className="page-container fade-in" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="glass-card welcome-card">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="welcome-logo" />
        <h1 className="welcome-title">Welcome to NeuroSketch</h1>
        <p className="welcome-subtitle">AI-Powered Drawing Evaluation</p>
        <button className="start-btn" onClick={() => nav('/start')}>Get Started</button>
      </div>
    </div>
  );
}

export default WelcomePage;
