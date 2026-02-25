import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import StartPage from './pages/StartPage';
import UploadForm from './components/UploadForm';
import DrawQRCodePage from './pages/DrawQRCodePage';
import DrawCanvasPage from './pages/DrawCanvasPage';
import ScoreDisplayPage from './pages/ScoreDisplayPage';        // for mobile (navigated with state)
import DoctorScorePage from "./components/DoctorScorePage";           // polling API



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/draw-qr" element={<DrawQRCodePage />} />
        <Route path="/draw-upload" element={<DrawCanvasPage />} />
        <Route path="/score-multi" element={<ScoreDisplayPage />} />
        <Route path="/doctor-scores" element={<DoctorScorePage />} />
        {/* 🔥 Make sure this line exists */}
      </Routes>
    </Router>
  );
}

export default App;
