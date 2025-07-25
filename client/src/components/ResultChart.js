import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ResultChart({ election }) {
  const labels = election.candidates.map(c => c.name);
  const votes = election.candidates.map(c => c.votes);

  const data = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: votes,
        backgroundColor: '#42a5f5',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    },
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ResultChart;
