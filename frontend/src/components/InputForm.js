import React, { useState } from "react";

const initialState = {
  size: 150,
  modules: 10,
  integration: "medium",
  tech_stack: "web",
  reusability: 60,
  team: 5,
  complexity: "medium",
};

function InputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "integration" || name === "tech_stack" || name === "complexity"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="card form-card form-grid" onSubmit={handleSubmit}>
      {/* Inputs grouped in a responsive card for a cleaner dashboard feel */}
      <label className="input-group">
        Project Size (KLOC)
        <input
          type="number"
          min="50"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="e.g. 150"
          required
        />
      </label>

      <label className="input-group">
        Module Count
        <input
          type="number"
          min="1"
          name="modules"
          value={formData.modules}
          onChange={handleChange}
          placeholder="e.g. 10"
          required
        />
      </label>

      <label className="input-group">
        Integration Level
        <select
          name="integration"
          value={formData.integration}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="input-group">
        Tech Stack
        <select
          name="tech_stack"
          value={formData.tech_stack}
          onChange={handleChange}
          required
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="ai">AI</option>
        </select>
      </label>

      <label className="input-group">
        Code Reusability (%)
        <input
          type="number"
          min="0"
          max="100"
          name="reusability"
          value={formData.reusability}
          onChange={handleChange}
          placeholder="0 to 100"
          required
        />
      </label>

      <label className="input-group">
        Team Size
        <input
          type="number"
          min="1"
          name="team"
          value={formData.team}
          onChange={handleChange}
          placeholder="e.g. 5"
          required
        />
      </label>

      <label className="input-group">
        Complexity
        <select
          name="complexity"
          value={formData.complexity}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <button type="submit" className="predict-btn" disabled={loading}>
        {loading ? "Predicting... ⏳" : "Predict"}
      </button>
    </form>
  );
}

export default InputForm;
