import React from "react";

function ResultDisplay({ cost, time }) {
  return (
    <div className="card result-grid result-card">
      <div className="result-box">
        <h3>💰 Estimated Cost</h3>
        <p>${Number(cost).toLocaleString()}</p>
      </div>
      <div className="result-box">
        <h3>⏱ Estimated Time</h3>
        <p>{Number(time).toFixed(2)} months</p>
      </div>
    </div>
  );
}

export default ResultDisplay;
