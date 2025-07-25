// ViewResults.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const API = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';

function ResultChart({ election }) {
  const labels = (election?.candidates ?? []).map((c) => c.name);
  const votes = (election?.candidates ?? []).map((c) => c.votes || 0);
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: votes,
        backgroundColor: ['#3b82f6', '#f97316', '#10b981', '#ef4444', '#a855f7'],
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      title: {
        display: true,
        text: 'Vote Count',
        font: { size: 16, weight: 'bold' },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percent =
              totalVotes === 0 ? 0 : ((value / totalVotes) * 100).toFixed(1);
            return `${value} votes (${percent}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0, color: '#6b7280' },
        title: {
          display: true,
          text: 'Votes',
          color: '#374151',
          font: { weight: 'bold' },
        },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { color: '#374151' },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: '250px', maxWidth: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

function ViewResults() {
  const [results, setResults] = useState([]); // always keep this an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You are not logged in. Please login again.');
        navigate('/login', { replace: true, state: { from: location } });
        return;
      }

      try {
        const res = await fetch(`${API}/api/vote/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Handle unauthorized explicitly
          if (res.status === 401) {
            setError('Session expired / unauthorized. Please login again.');
            navigate('/login', { replace: true, state: { from: location } });
            return;
          }
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 API Response:', data);

        // Normalize to an array, no matter how backend sends it
        const normalized =
          Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setResults(normalized);
      } catch (e) {
        console.error('❌ Fetch failed:', e);
        setError(e.message || 'Something went wrong');
        setResults([]); // keep it an array to avoid map/length crashes
      } finally {
        setLoading(false);
      }
    })();
  }, [location, navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Election Results</h2>

      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {loading && <p style={styles.info}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && Array.isArray(results) && results.length === 0 && (
        <p style={styles.noResults}>No results available yet.</p>
      )}

      {!loading &&
        !error &&
        Array.isArray(results) &&
        results.length > 0 &&
        results.map((result) => (
          <div key={result._id || result.id} style={styles.card}>
            <h3 style={styles.electionTitle}>{result.title}</h3>

            <div style={styles.candidateList}>
              {(result.candidates ?? []).map((c) => (
                <p key={c._id || c.id} style={styles.candidateText}>
                  <strong>{c.name}</strong>: {c.votes ?? 0} votes
                </p>
              ))}
            </div>

            <ResultChart election={result} />
          </div>
        ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: '20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '14px',
  },
  info: {
    fontSize: '16px',
    color: '#374151',
    textAlign: 'center',
  },
  error: {
    fontSize: '16px',
    color: '#dc2626',
    textAlign: 'center',
  },
  noResults: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '0 auto 30px auto',
  },
  electionTitle: {
    fontSize: '20px',
    color: '#1d4ed8',
    marginBottom: '10px',
    textAlign: 'center',
  },
  candidateList: {
    marginBottom: '15px',
    color: '#374151',
  },
  candidateText: {
    fontSize: '15px',
    marginBottom: '4px',
  },
};

export default ViewResults;
