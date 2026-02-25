// src/pages/UploadForm.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.css';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function UploadForm() {
  const { state } = useLocation();
  const original = state?.original;
  const nav = useNavigate();
  const [slots, setSlots] = useState({ slot1: null, slot2: null, slot3: null });

  const uploadOriginal = async (file) => {
    const form = new FormData();
    form.append('original', file);
    await axios.post(`${BACKEND_BASE_URL}/upload_original`, form);
  };

  const uploadUserDrawing = async (file, sessionId) => {
    const form = new FormData();
    form.append('user_drawing', file);
    await axios.post(`${BACKEND_BASE_URL}/upload_drawing/${sessionId}`, form);
  };

  const sendScore = async () => {
    if (!original || Object.values(slots).some(f => !f)) {
      return alert("Please upload the original and all 3 user drawings.");
    }

    try {
      await uploadOriginal(original);
        await Promise.all(
          [1, 2, 3].map(i => uploadUserDrawing(slots[`slot${i}`], i))
        );

      nav('/doctor-scores');
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="page-container fade-in" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})` }}>
      <div className="glass-card upload-card">
        <h2 className="upload-title">Upload Drawings (3 times)</h2>
        {[1,2,3].map(i => (
          <div key={i} className="upload-slot">
            <label>Drawing {i}:</label>
            <input type="file" onChange={e => setSlots(s => ({...s, [`slot${i}`]: e.target.files[0]}))} />
          </div>
        ))}
        <button className="submit-btn" onClick={sendScore}>See Scorecard</button>
      </div>
    </div>
  );
}

export default UploadForm;
