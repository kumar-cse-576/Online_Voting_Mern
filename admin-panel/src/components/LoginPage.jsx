import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseURL = process.env.REACT_APP_API_URL;
    const endpoint = isRegistering
      ? `${baseURL}/api/admin/register`
      : `${baseURL}/api/admin/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || (isRegistering ? 'Registration failed' : 'Login failed'));
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <style>{`
        .auth-container {
          max-width: 400px;
          margin: 80px auto;
          padding: 30px;
          border: 1px solid #ccc;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          text-align: center;
          font-family: sans-serif;
        }

        .auth-container h2 {
          margin-bottom: 20px;
        }

        .auth-container input {
          width: 90%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #aaa;
          border-radius: 5px;
        }

        .auth-container button {
          padding: 10px 20px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .auth-container button:hover {
          background: #125da7;
        }

        .switch-mode {
          background: transparent;
          color: #1976d2;
          border: none;
          margin-top: 10px;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="auth-container">
        <h2>{isRegistering ? '📝 Admin Register' : '🔐 Admin Login'}</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <button
          type="button"
          className="switch-mode"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </form>
    </>
  );
}

export default AdminAuthPage;
