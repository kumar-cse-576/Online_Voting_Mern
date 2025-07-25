import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function CreateElection() {
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState(['']);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const removeCandidate = (index) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/create-election`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, candidates })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Election created successfully!');
        setTitle('');
        setCandidates(['']);
      } else {
        setMessage(`❌ ${data.message || 'Failed to create election'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error while creating election');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Voting</h2>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            placeholder="Voting Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Candidates:</label>
          {candidates.map((name, index) => (
            <div key={index} style={styles.candidateRow}>
              <input
                type="text"
                placeholder={`Candidate ${index + 1}`}
                value={name}
                onChange={e => handleCandidateChange(index, e.target.value)}
                required
                style={styles.candidateInput}
              />
              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addCandidate} style={styles.addButton}>
            + Add Candidate
          </button>

          <button type="submit" style={styles.submitButton}>
            Create Voting
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '15px',
            textAlign: 'center',
            color: message.startsWith('✅') ? 'green' : 'red'
          }}>
            {message}
          </p>
        )}

        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  candidateRow: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  candidateInput: {
    flex: 1,
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px'
  },
  removeButton: {
    padding: '6px 10px',
    borderRadius: '4px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  addButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#2ecc71',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  backButton: {
    marginTop: '20px',
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default CreateElection;
