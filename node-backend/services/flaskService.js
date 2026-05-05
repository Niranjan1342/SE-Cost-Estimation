const axios = require('axios');

const FLASK_API_URL = 'http://localhost:5000/predict';

/**
 * Service to communicate with the Flask ML API
 */
const getPrediction = async (inputData) => {
  try {
    const response = await axios.post(FLASK_API_URL, inputData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data && response.data.status === 'success') {
      return {
        success: true,
        data: {
          cost: response.data.cost,
          time: response.data.time,
          featureImportance: response.data.feature_importance,
          whatIfAnalysis: response.data.what_if,
        },
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Flask API returned an error',
      };
    }
  } catch (error) {
    let message = 'Error connecting to the prediction service';
    if (error.code === 'ECONNABORTED') {
      message = 'Prediction service timed out';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = error.response.data?.message || `Flask API error: ${error.response.status}`;
    }
    return {
      success: false,
      message,
    };
  }
};

module.exports = {
  getPrediction,
};
