import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import VotePage from './pages/VotePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // ✅ must exist


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vote" element={<VotePage />} />

      </Routes>
    </Router>
  );
}

export default App;
