// src/pages/StartPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function StartPage() {
  const [orig, setOrig] = useState(null);
  const nav = useNavigate();

  const go = (mode) => {
    if (!orig) return alert('Please upload the original image first.');
    nav(mode==='upload' ? '/upload' : '/draw-qr', { state: { original: orig } });
  };

  return (
    <div className="page-container fade-in" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})`}}>
      <div className="glass-card upload-card">
        <h2 className="upload-title">Upload Original Image</h2>
        <div className="input-group">
          <input type="file" onChange={e => setOrig(e.target.files[0])} />
        </div>
        <h3 className="upload-subtitle">Choose Drawing Method</h3>
        <div className="button-group">
          <button className="submit-btn" onClick={() => go('upload')}>Upload Drawing</button>
          <button className="submit-btn" onClick={() => go('draw')}>Draw Using Device</button>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
