// src/pages/SessionPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/App.css';
import QRCode from 'react-qr-code';

function SessionPage() {
  const { sessionId } = useParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/score/${sessionId}`);
      if (res.ok) setScore(await res.json());
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="page-container">
      <div className="glass-card welcome-card welcome-container">
        <h1 className="welcome-title">Session ID: {sessionId}</h1>
        <p className="welcome-subtitle">Have the patient scan this QR code:</p>
        <QRCode value={`${window.location.origin}/draw/${sessionId}`} />
        {score && (
          <>
            <h2 className="upload-title">Latest Score</h2>
            <div className="score-container">
              <div className="glass-card score-card">
                <h3 className="score-title">Scoring Results</h3>
                <ul className="score-list">
                  <li><strong>Shape:</strong> {score.shape_score}</li>
                  <li><strong>SSIM:</strong> {score.ssim_score}</li>
                  <li><strong>Area:</strong> {score.area_similarity}</li>
                  <li><strong>Final:</strong> {score.final_score}%</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SessionPage;
