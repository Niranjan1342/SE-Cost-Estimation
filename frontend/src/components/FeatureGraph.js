import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function FeatureGraph({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="card chart-card">
        <h3>Feature Importance</h3>
        <p className="no-data">No data available.</p>
      </div>
    );
  }

  const labels = data.map((item) => item.feature);
  const values = data.map((item) => item.importance);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Feature Importance",
        data: values,
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3>Feature Importance</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default FeatureGraph;
