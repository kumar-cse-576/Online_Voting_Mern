import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
 
    
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>🗳️ Welcome to Online Voting App</h1>
      <button onClick={() => navigate('/login')} style={{ margin: '10px' }}>
        Login
      </button>
      <button onClick={() => navigate('/register')} style={{ margin: '10px' }}>
        Register
      </button>
    </div>
    
  );
}

export default HomePage;