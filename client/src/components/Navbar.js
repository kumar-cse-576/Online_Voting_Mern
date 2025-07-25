// client/src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // We'll use separate CSS

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* <div className="nav-left">
        <button onClick={() => navigate('/')}>🏠 Home</button>
        <button onClick={() => navigate('/vote')}>🗳️ Vote</button>
      </div> */}
      {token && (
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>
            🔒 Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
