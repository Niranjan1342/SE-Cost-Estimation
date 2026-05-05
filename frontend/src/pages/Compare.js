import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ComparisonChart from '../components/ComparisonChart';
import { compareProjects } from '../services/api';
import { AlertCircle } from 'lucide-react';

const Compare = () => {
  const [project1, setProject1] = useState(null);
  const [project2, setProject2] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunComparison = async () => {
    if (!project1 || !project2) {
      setError('Please fill out both project configurations first.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await compareProjects(project1, project2);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare projects.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="compare-page">
      <div className="page-header">
        <h1>Compare Projects</h1>
        <p>Run a side-by-side what-if analysis of two configurations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="compare-grid">
        <div className="compare-col">
          <h2 className="section-title">Configuration A</h2>
          <PredictionForm 
            onSubmit={(data) => {
              setProject1(data);
              if(project2) setError('');
            }} 
            isLoading={false} 
          />
          {project1 && <div className="success-text mt-2"><AlertCircle size={16}/> Config A Saved</div>}
        </div>

        <div className="compare-col">
          <h2 className="section-title">Configuration B</h2>
          <PredictionForm 
            onSubmit={(data) => {
              setProject2(data);
              if(project1) setError('');
            }} 
            isLoading={false} 
          />
          {project2 && <div className="success-text mt-2"><AlertCircle size={16}/> Config B Saved</div>}
        </div>
      </div>

      <div className="compare-action">
        <button 
          className="btn-primary btn-large" 
          onClick={handleRunComparison}
          disabled={!project1 || !project2 || isLoading}
        >
          {isLoading ? 'Running Comparison...' : 'Compare Configurations'}
        </button>
      </div>

      {result && (
        <div className="comparison-results fade-in">
          <ComparisonChart data={result} />
          
          <div className="comparison-summary card">
            <h3>Analysis Summary</h3>
            <div className="summary-stats">
              <div className="stat-box">
                <span className="stat-label">Cost Difference</span>
                <span className={`stat-value ${result.difference.costPercent > 0 ? 'text-danger' : 'text-success'}`}>
                  {result.difference.costPercent > 0 ? '+' : ''}{result.difference.costPercent}%
                </span>
                <p className="stat-desc">Config B vs Config A</p>
              </div>
              <div className="stat-box">
                <span className="stat-label">Time Difference</span>
                <span className={`stat-value ${result.difference.timePercent > 0 ? 'text-danger' : 'text-success'}`}>
                  {result.difference.timePercent > 0 ? '+' : ''}{result.difference.timePercent}%
                </span>
                <p className="stat-desc">Config B vs Config A</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
