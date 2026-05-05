import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryTable from '../components/HistoryTable';
import { getHistory } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        if (res.data.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleReRun = (inputData) => {
    // We could pass this via state or context, but for simplicity we will navigate to dashboard 
    // and rely on the user to manually enter, or we can use local storage to pre-fill.
    localStorage.setItem('presetForm', JSON.stringify(inputData));
    navigate('/');
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Prediction History</h1>
        <p>Review and re-run your past cost estimations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading history...</div>
      ) : (
        <HistoryTable history={history} onReRun={handleReRun} />
      )}
    </div>
  );
};

export default History;
