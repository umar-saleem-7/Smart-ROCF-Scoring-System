// src/pages/PatientScorePage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function PatientScorePage() {
  const location = useLocation();
  const [scores, setScores] = useState(location.state?.scores || []);

  const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://192.168.56.1:5000';

  useEffect(() => {
    if (!location.state?.scores) {
      axios.get(`${BACKEND_BASE_URL}/get_all_scores`)
        .then((res) => {
          const scoreData = Object.values(res.data)
            .filter((s) => s.status === 'Scored' && s.score)
            .map((s) => s.score); // Array of score objects

          setScores(scoreData);
        })
        .catch((err) => {
          console.error("Error fetching scores:", err);
        });
    }
  }, [location.state, BACKEND_BASE_URL]);

  return (
    <div
      className="page-container fade-in"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div
        className="glass-card score-wrapper"
        style={{
          maxWidth: "900px",
          width: "100%",
          margin: "0 auto",
          padding: "30px 20px",
        }}
      >
        <h1
          className="score-title"
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: "30px",
            fontSize: "2rem",
            fontWeight: "600",
          }}
        >
          📝 Your Scorecard
        </h1>

        {scores.length === 0 ? (
          <p className="warning-text" style={{ textAlign: "center", color: "#fff" }}>
            ⚠️ No scores available.
          </p>
        ) : (
          <div
            className="score-grid"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {scores.map((score, index) => (
              <div
                key={index}
                className="score-card fade-in"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  color: "#fff",
                }}
              >
                <h3
                  className="score-session-title"
                  style={{ fontSize: "1.3rem", marginBottom: "16px" }}
                >
                  📊 Session {index + 1}
                </h3>
                <div className="score-metric">
                  <strong>🔷 Shape Score:</strong> {score.shape_score}
                </div>
                <div className="score-metric">
                  <strong>🟢 SSIM Score:</strong> {score.ssim_score}
                </div>
                <div className="score-metric">
                  <strong>🧩 ORB Score:</strong> {score.orb_score}
                </div>
                <div className="score-metric">
                  <strong>⚙️ Hu Moments:</strong> {score.hu_score}
                </div>
                <div className="score-metric">
                  <strong>📐 Area Similarity:</strong> {score.area_similarity}
                </div>
                <div
                  className="final-score"
                  style={{
                    marginTop: "12px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#ffd700", // golden color
                  }}
                >
                  🎯 Final Score: <span>{score.final_score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
