import React, { useState, useEffect } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCards from '../components/ResultCards';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import WhatIfChart from '../components/WhatIfChart';
import RiskIndicator from '../components/RiskIndicator';
import { predict } from '../services/api';

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [currentInput, setCurrentInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const presetForm = localStorage.getItem('presetForm');
    if (presetForm) {
      try {
        const parsed = JSON.parse(presetForm);
        handlePrediction(parsed);
        localStorage.removeItem('presetForm');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handlePrediction = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await predict(formData);
      if (res.data.success) {
        setResult(res.data.data);
        setCurrentInput(formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Overview Dashboard</h1>
        <p>Estimate software costs using AI-driven analysis</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-col-left">
          <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
        </div>

        <div className="dashboard-col-right">
          {result ? (
            <div className="results-wrapper fade-in">
              <div className="results-header">
                <ResultCards cost={result.cost} time={result.time} />
                <RiskIndicator 
                  complexity={currentInput?.complexity} 
                  integration={currentInput?.integration} 
                />
              </div>

              <div className="charts-grid">
                <FeatureImportanceChart data={result.featureImportance} />
                <WhatIfChart data={result.whatIfAnalysis} />
              </div>
            </div>
          ) : (
            <div className="card empty-state">
              <div className="empty-state-content">
                <h3>No Prediction Data Yet</h3>
                <p>Fill out the form on the left and run an estimation to see the analysis dashboard.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
