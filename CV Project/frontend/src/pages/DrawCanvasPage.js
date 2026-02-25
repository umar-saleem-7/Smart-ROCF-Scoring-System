// src/pages/DrawCanvasPage.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DrawCanvasPage = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sessionId, setSessionId] = useState(1);
  const [sessionScores, setSessionScores] = useState([]);
  const navigate = useNavigate();

  // Use actual IP for mobile instead of localhost
  const BACKEND_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.56.1:5000"; // replace with your actual local IP

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX
      ? e.clientX - rect.left
      : e.touches[0].clientX - rect.left;
    const y = e.clientY
      ? e.clientY - rect.top
      : e.touches[0].clientY - rect.top;
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX
      ? e.clientX - rect.left
      : e.touches[0].clientX - rect.left;
    const y = e.clientY
      ? e.clientY - rect.top
      : e.touches[0].clientY - rect.top;
    const context = canvas.getContext("2d");
    context.lineTo(x, y);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDone = async () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();

    const form = new FormData();
    form.append("user_drawing", blob, `user_drawing_${sessionId}.png`);

    try {
      const res = await axios.post(
        `${BACKEND_BASE_URL}/upload_drawing/${sessionId}`,
        form
      );

      const score = res.data?.score || null;
      if (!score) {
        alert("Scoring failed. Please try again.");
        return;
      }

      // Append this session's score to list
      setSessionScores((prev) => [...prev, score]);

      if (sessionId < 3) {
        setSessionId(sessionId + 1);
        // Reset canvas for next session
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // All sessions completed
        navigate("/score-multi", {
          state: { scores: sessionScores.concat(score) }, // include last score
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image. Please ensure you're on same WiFi and try again.");
    }
  };

  return (
    <div
      className="page-container centered"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Draw Image on Device
      </h2>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{
          border: "2px solid white",
          backgroundColor: "white",
          borderRadius: "8px",
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <p style={{ marginTop: "10px", color: "white" }}>
        Session: {sessionId} of 3
      </p>
      <button
        onClick={handleDone}
        className="btn btn-primary mt-3"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        Done with this session
      </button>
    </div>
  );
};

export default DrawCanvasPage;
