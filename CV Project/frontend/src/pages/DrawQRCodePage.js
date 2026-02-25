import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';
import '../styles/App.css';

function DrawQRCodePage() {
  const { state } = useLocation();
  const nav = useNavigate();
  const [allScored, setAllScored] = useState(false);
  const intervalRef = useRef(null);

  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://192.168.56.1:5000';
  const FRONTEND_BASE_URL = process.env.REACT_APP_FRONTEND_URL || `http://192.168.56.1:3000`;
  const canvasUrl = `${FRONTEND_BASE_URL}/draw-upload`;

  useEffect(() => {
    const checkScores = () => {
      axios.get(`${BACKEND_BASE_URL}/get_all_scores`)
        .then(response => {
          const scores = response.data;
          const allDone = Object.values(scores).every(s => s.status === 'Scored');
          setAllScored(allDone);
          if (allDone) clearInterval(intervalRef.current); // Stop polling when all are scored
        })
        .catch(err => {
          console.error('Error fetching scores:', err);
        });
    };

    intervalRef.current = setInterval(checkScores, 5000);
    checkScores(); // Run immediately on mount

    return () => clearInterval(intervalRef.current);
  }, [BACKEND_BASE_URL])

  if (!state?.original) {
    return <Navigate to="/start" replace />;
  }

  return (
    <div
      className="page-container fade-in"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-card upload-card">
        <h2 className="upload-title">📱 Draw Using Another Device</h2>

        <div className="qr-container">
          <QRCode value={canvasUrl} size={150} />
          <p>Scan this QR to open the canvas on your device.</p>
        </div>

        <div className="score-button-container" style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            className="submit-btn"
            onClick={() => nav('/score-multi')}
          >
            View Scorecard
          </button>

          {!allScored && (
            <p className="warning-text" style={{ fontSize: '14px', marginTop: '10px' }}>
              ⏳ Some drawings may still be pending.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrawQRCodePage;
