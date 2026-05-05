import React from 'react';
import { RotateCcw } from 'lucide-react';

const HistoryTable = ({ history, onReRun }) => {
  if (!history || history.length === 0) {
    return <div className="card empty-state">No past predictions found.</div>;
  }

  return (
    <div className="card history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Parameters Summary</th>
            <th>Est. Cost</th>
            <th>Est. Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="params-cell">
                <span className="badge">Size: {item.inputData.size}</span>
                <span className="badge">Team: {item.inputData.team}</span>
                <span className="badge">{item.inputData.tech_stack}</span>
              </td>
              <td className="cost-cell">${item.predictedCost.toLocaleString()}</td>
              <td className="time-cell">{item.predictedTime.toFixed(1)} m</td>
              <td>
                <button 
                  className="btn-icon rerun-btn" 
                  onClick={() => onReRun(item.inputData)}
                  title="Re-run this prediction"
                >
                  <RotateCcw size={16} /> Re-run
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
