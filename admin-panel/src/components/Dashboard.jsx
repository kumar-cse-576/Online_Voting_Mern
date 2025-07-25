import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <>
      <style>{`
        .dashboard-container {
          max-width: 450px;
          margin: 60px auto;
          padding: 30px;
          border: 1px solid #ccc;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #fefefe;
        }

        .dashboard-title {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }

        .dashboard-btn {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          background-color: #1976d2;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .dashboard-btn:hover {
          background-color: #125da7;
        }

        .logout-btn {
          background-color: #e53935;
        }

        .logout-btn:hover {
          background-color: #c62828;
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-title">🛠️ Admin Panel</div>

        <button className="dashboard-btn" onClick={() => navigate('/create')}>
          ➕ Create New Election
        </button>

        <button className="dashboard-btn" onClick={() => navigate('/results')}>
          📊 View Election Results
        </button>

        <button className="dashboard-btn" onClick={() => navigate('/delete')}>
          🗑️ Manage / Delete Elections
        </button>

        <button className="dashboard-btn logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;
