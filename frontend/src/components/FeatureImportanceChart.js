import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FeatureImportanceChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.importance - a.importance);

  const chartData = {
    labels: sortedData.map(d => d.feature.charAt(0).toUpperCase() + d.feature.slice(1)),
    datasets: [
      {
        label: 'Feature Importance Weight',
        data: sortedData.map(d => d.importance),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
        borderRadius: 4,
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
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="card chart-card">
      <h3 className="chart-title">Feature Importance Analysis</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default FeatureImportanceChart;
