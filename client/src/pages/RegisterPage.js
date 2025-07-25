import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const API = process.env.REACT_APP_API_URL;

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^[2-9]{1}[0-9]{11}$/.test(aadhar)) {
      setMessage('❌ Invalid Aadhar number');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        username,
        password,
        aadhar,
        role: 'voter'
      });

      setMessage(res.data.message);

      setTimeout(() => {
        window.location.href = `/login`;

      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 Voter Registration</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Aadhar Number"
          required
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
