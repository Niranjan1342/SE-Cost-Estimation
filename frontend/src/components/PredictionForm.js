import React, { useState } from 'react';

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    size: 100,
    modules: 5,
    team: 5,
    reusability: 50,
    integration: 'medium',
    complexity: 'medium',
    tech_stack: 'web'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['size', 'modules', 'team', 'reusability'].includes(name) 
      ? Number(value) 
      : value;
      
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="card prediction-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Project Parameters</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Project Size (KLOC)</label>
          <input type="number" name="size" value={formData.size} onChange={handleChange} min="1" required />
        </div>

        <div className="form-group">
          <label>Modules Count</label>
          <input type="number" name="modules" value={formData.modules} onChange={handleChange} min="1" required />
        </div>

        <div className="form-group">
          <label>Integration Level</label>
          <select name="integration" value={formData.integration} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Complexity</label>
          <select name="complexity" value={formData.complexity} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tech Stack</label>
          <select name="tech_stack" value={formData.tech_stack} onChange={handleChange}>
            <option value="web">Web Application</option>
            <option value="mobile">Mobile Application</option>
            <option value="ai">AI / Machine Learning</option>
          </select>
        </div>
      </div>

      <div className="sliders-section">
        <div className="form-group">
          <div className="slider-header">
            <label>Team Size</label>
            <span className="slider-value">{formData.team} members</span>
          </div>
          <input 
            type="range" 
            name="team" 
            min="1" 
            max="50" 
            value={formData.team} 
            onChange={handleChange} 
            className="slider"
          />
        </div>

        <div className="form-group">
          <div className="slider-header">
            <label>Code Reusability</label>
            <span className="slider-value">{formData.reusability}%</span>
          </div>
          <input 
            type="range" 
            name="reusability" 
            min="0" 
            max="100" 
            value={formData.reusability} 
            onChange={handleChange} 
            className="slider"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary full-width" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Run Estimation'}
      </button>
    </form>
  );
};

export default PredictionForm;
