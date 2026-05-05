import React from 'react';
import { DollarSign, Clock } from 'lucide-react';

const ResultCards = ({ cost, time }) => {
  return (
    <div className="result-cards-container">
      <div className="card result-card cost-card">
        <div className="result-icon-wrapper">
          <DollarSign size={32} />
        </div>
        <div className="result-info">
          <h3>Estimated Cost</h3>
          <h2>${cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h2>
        </div>
      </div>
      
      <div className="card result-card time-card">
        <div className="result-icon-wrapper">
          <Clock size={32} />
        </div>
        <div className="result-info">
          <h3>Estimated Time</h3>
          <h2>{time ? time.toFixed(2) : '0.00'} months</h2>
        </div>
      </div>
    </div>
  );
};

export default ResultCards;
