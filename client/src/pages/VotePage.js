import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/Navbar'; // keep Navbar as separate

const API = process.env.REACT_APP_API_URL;

function VotePage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(`${API}/api/vote/elections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setElections(res.data);
        setLoading(false);
      } catch (err) {
        setMessage('❌ Failed to load elections');
        setLoading(false);
      }
    };

    fetchElections();
  }, [token]);

  const handleVote = async (electionId, candidateName) => {
    try {
      const res = await axios.post(
        `${API}/api/vote/cast`,
        { electionId, candidateName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);

      const updated = await axios.get(`${API}/api/vote/elections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(updated.data);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Vote failed');
    }
  };

  const ResultChart = ({ election }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E74C3C', '#9B59B6'];
    const data = election.candidates.map((c) => ({
      name: c.name,
      value: c.votes,
    }));

    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
        Loading elections...
      </p>
    );
  }

  return (
    <div style={styles.voteContainer}>
      <Navbar />
      <h2 style={styles.pageTitle}>🗳️ Active Elections</h2>
      {message && <div style={styles.alertBox}>{message}</div>}

      <div style={styles.electionsGrid}>
        {elections.map((election) => (
          <div key={election._id} style={styles.electionCard}>
            <h3 style={styles.electionTitle}>{election.title}</h3>

            <div style={styles.candidateList}>
              {election.candidates.map((candidate, index) => (
                <div key={index} style={styles.candidateRow}>
                  <span>
                    {candidate.name} - {candidate.votes} votes
                  </span>
                  <button
                    style={styles.voteButton}
                    onClick={() => handleVote(election._id, candidate.name)}
                  >
                    Vote
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.chartContainer}>
              <ResultChart election={election} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  voteContainer: {
    maxWidth: '1100px',
    margin: 'auto',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  pageTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  alertBox: {
    backgroundColor: '#fef4e5',
    color: '#e67e22',
    border: '1px solid #e67e22',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  electionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
  },
  electionCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    padding: '20px',
    transition: 'transform 0.2s ease-in-out',
  },
  electionTitle: {
    fontSize: '1.5rem',
    color: '#2980b9',
    marginBottom: '16px',
    textAlign: 'center',
  },
  candidateList: {
    marginBottom: '20px',
  },
  candidateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px dashed #ddd',
  },
  voteButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  chartContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
};

export default VotePage;
