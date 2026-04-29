import React, { useState } from "react";
import axios from "axios";
import InputForm from "./components/InputForm";
import ResultDisplay from "./components/ResultDisplay";
import FeatureGraph from "./components/FeatureGraph";
import WhatIfGraph from "./components/WhatIfGraph";

const API_URL = "http://localhost:5000/predict";
const REPORT_API_URL = "http://localhost:5000/generate_report";

function App() {
  const [result, setResult] = useState(null);
  const [lastInput, setLastInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportStatus, setReportStatus] = useState("");
  const [reportError, setReportError] = useState("");

  const handlePredict = async (formData) => {
    setLoading(true);
    setError("");
    setStatusMessage("");
    setReportStatus("");
    setReportError("");
    setLastInput(formData);
    console.log("[Predict] Request payload:", formData);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[Predict] Response data:", response.data);

      if (response.data?.status === "success") {
        setResult(response.data);
        setStatusMessage("Prediction successful.");
      } else {
        const message =
          response.data?.message || "Prediction failed with unknown error.";
        setError(message);
        setResult(null);
      }
    } catch (err) {
      console.error("[Predict] API error:", err);
      const message =
        err.response?.data?.message ||
        "Unable to connect to server. Please ensure backend is running on port 5000.";
      setError(message);
      setStatusMessage("");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result || !lastInput) {
      setReportError("No prediction data found. Please run Predict first.");
      return;
    }

    setReportLoading(true);
    setReportStatus("");
    setReportError("");

    const payload = {
      ...lastInput,
      cost: result.cost,
      time: result.time,
    };
    console.log("[Report] Request payload:", payload);

    try {
      // Request PDF as binary blob and trigger browser download.
      const response = await axios.post(REPORT_API_URL, payload, {
        responseType: "blob",
        headers: { "Content-Type": "application/json" },
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;

      const contentDisposition = response.headers["content-disposition"] || "";
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      link.download = filenameMatch?.[1] || `report_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      setReportStatus("Report downloaded successfully ✅");
    } catch (err) {
      console.error("[Report] API error:", err);
      setReportError("Failed to generate report ❌");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        {/* Header section: centered hero-style project intro */}
        <header className="hero-header card">
          <h1>AI-Based Software Cost Estimation</h1>
          <p className="subtitle">
            AI-Based Software Cost Estimation System
          </p>
          <p className="hero-copy">
            Estimate project cost and timeline with feature importance and what-if
            analysis.
          </p>
        </header>

        <InputForm onSubmit={handlePredict} loading={loading} />

        {loading && (
          <div className="info-box loading-box">
            <span className="spinner" /> Predicting project estimates...
          </div>
        )}

        {statusMessage && !loading && (
          <div className="info-box success-box">✅ {statusMessage}</div>
        )}

        {error && <div className="error-box">{error}</div>}

        {result && (
          <section className="fade-in-up">
            <ResultDisplay cost={result.cost} time={result.time} />
            <div className="report-action-row">
              <button
                type="button"
                className="report-btn"
                onClick={handleDownloadReport}
                disabled={reportLoading}
              >
                {reportLoading ? "Generating report..." : "📄 Download Report"}
              </button>
            </div>
            {reportStatus && <div className="info-box success-box">{reportStatus}</div>}
            {reportError && <div className="error-box">{reportError}</div>}
            <div className="graph-grid">
              <FeatureGraph data={result.feature_importance} />
              <WhatIfGraph data={result.what_if} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
