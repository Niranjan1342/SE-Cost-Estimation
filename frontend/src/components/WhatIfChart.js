import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WhatIfChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => `${d.team} Members`),
    datasets: [
      {
        label: 'Simulated Cost ($)',
        data: data.map(d => d.cost),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: false }
    }
  };

  return (
    <div className="card chart-card">
      <h3 className="chart-title">What-If Analysis: Cost vs Team Size</h3>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WhatIfChart;
