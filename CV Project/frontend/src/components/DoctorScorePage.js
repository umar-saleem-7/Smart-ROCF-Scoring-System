// src/pages/DoctorScorePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/App.css";

export default function DoctorScorePage() {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get("http://localhost:5000/get_all_scores");
        setScores(res.data);
      } catch (err) {
        console.error("Error fetching scores", err);
        setScores(null);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

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
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "30px 20px",
          margin: "0 auto",
        }}
      >
        <h1
          className="upload-title"
          style={{
            textAlign: "center",
            color: "#fff",
            fontSize: "2rem",
            marginBottom: "30px",
          }}
        >
          📋 All Session Drawing Scores
        </h1>

        {loading ? (
          <p className="loading-text" style={{ color: "#fff", textAlign: "center" }}>
            ⏳ Loading scores... Please wait.
          </p>
        ) : !scores ? (
          <p className="error-text" style={{ color: "#ff4d4d", textAlign: "center" }}>
            ❌ Unable to load scores.
          </p>
        ) : (
          <div
            className="score-wrapper-horizontal"
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {[1, 2, 3].map((i) => {
              const session = scores[`session_${i}`];
              return (
                <div
                  key={i}
                  className="score-card fade-in"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                    color: "#fff",
                    flex: "1 1 300px",
                    minWidth: "280px",
                    maxWidth: "360px",
                  }}
                >
                  <h3
                    className="score-title"
                    style={{ fontSize: "1.2rem", marginBottom: "16px" }}
                  >
                    🧪 Session {i}
                  </h3>
                  {!session ? (
                    <p>⚠️ No data available.</p>
                  ) : session.status === "Scored" ? (
                    <>
                      <div className="score-metric"><strong>🔷 Shape Score:</strong> {session.score.shape_score}</div>
                      <div className="score-metric"><strong>🟢 SSIM Score:</strong> {session.score.ssim_score}</div>
                      <div className="score-metric"><strong>🧩 ORB Score:</strong> {session.score.orb_score}</div>
                      <div className="score-metric"><strong>⚙️ Hu Moments:</strong> {session.score.hu_score}</div>
                      <div className="score-metric"><strong>📐 Area Similarity:</strong> {session.score.area_similarity}</div>
                      <div
                        className="final-score"
                        style={{
                          marginTop: "12px",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          color: "#000435",
                        }}
                      >
                        🎯 Final Score: {session.score.final_score}%
                      </div>
                    </>
                  ) : session.status === "Not uploaded yet" ? (
                    <p>⚠️ No drawing uploaded for this session.</p>
                  ) : (
                    <p>❌ Error: {session.error || "Unknown error"}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
