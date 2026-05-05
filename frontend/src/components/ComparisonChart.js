import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonChart = ({ data }) => {
  if (!data) return null;

  const { project1, project2 } = data;

  const costData = {
    labels: ['Project 1', 'Project 2'],
    datasets: [
      {
        label: 'Estimated Cost ($)',
        data: [project1.cost, project2.cost],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderRadius: 4,
      }
    ],
  };

  const timeData = {
    labels: ['Project 1', 'Project 2'],
    datasets: [
      {
        label: 'Estimated Time (Months)',
        data: [project1.time, project2.time],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderRadius: 4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="card chart-card comparison-chart" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 className="chart-title" style={{ marginBottom: '0.5rem' }}>Cost Comparison</h3>
        <div className="chart-container" style={{ height: '200px' }}>
          <Bar data={costData} options={options} />
        </div>
      </div>
      <div>
        <h3 className="chart-title" style={{ marginBottom: '0.5rem' }}>Time Comparison</h3>
        <div className="chart-container" style={{ height: '200px' }}>
          <Bar data={timeData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
