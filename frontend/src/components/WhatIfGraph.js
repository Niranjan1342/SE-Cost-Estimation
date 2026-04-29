import React from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function WhatIfGraph({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="card chart-card">
        <h3>What-If Analysis (Team Size vs Cost)</h3>
        <p className="no-data">No data available.</p>
      </div>
    );
  }

  const labels = data.map((item) => item.team);
  const values = data.map((item) => item.cost);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Predicted Cost",
        data: values,
        borderColor: "rgba(14, 165, 233, 1)",
        backgroundColor: "rgba(14, 165, 233, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Team Size",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cost",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3>What-If Analysis (Team Size vs Cost)</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default WhatIfGraph;
