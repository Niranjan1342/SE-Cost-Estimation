const ProjectHistory = require('../models/ProjectHistory');
const { validatePredictionInput } = require('../utils/validators');
const flaskService = require('../services/flaskService');

/**
 * @route   POST /api/projects/predict
 * @desc    Get cost and time prediction from ML backend
 * @access  Private
 */
const predictProject = async (req, res) => {
  try {
    const inputData = req.body;

    // Validate input
    const validation = validatePredictionInput(inputData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + validation.errors.join(', '),
      });
    }

    // Call Flask API via service
    const flaskResponse = await flaskService.getPrediction(inputData);

    if (!flaskResponse.success) {
      return res.status(502).json({
        success: false,
        message: flaskResponse.message,
      });
    }

    const { cost, time, featureImportance, whatIfAnalysis } = flaskResponse.data;

    // Save result in MongoDB
    await ProjectHistory.create({
      userId: req.user._id,
      inputData,
      predictedCost: cost,
      predictedTime: time,
      featureImportance,
      whatIfAnalysis,
    });

    // Return structured response
    res.status(200).json({
      success: true,
      data: {
        cost,
        time,
        featureImportance,
        whatIfAnalysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during prediction' });
  }
};

/**
 * @route   GET /api/projects/history
 * @desc    Get logged in user's project prediction history
 * @access  Private
 */
const getProjectHistory = async (req, res) => {
  try {
    const history = await ProjectHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

/**
 * @route   POST /api/projects/compare
 * @desc    Compare two projects side-by-side
 * @access  Private
 */
const compareProjects = async (req, res) => {
  try {
    const { project1, project2 } = req.body;

    if (!project1 || !project2) {
      return res.status(400).json({ success: false, message: 'Please provide both project1 and project2' });
    }

    // Validate both inputs
    const val1 = validatePredictionInput(project1);
    if (!val1.isValid) {
      return res.status(400).json({ success: false, message: 'project1 validation error: ' + val1.errors.join(', ') });
    }

    const val2 = validatePredictionInput(project2);
    if (!val2.isValid) {
      return res.status(400).json({ success: false, message: 'project2 validation error: ' + val2.errors.join(', ') });
    }

    // Call Flask API twice (in parallel)
    const [res1, res2] = await Promise.all([
      flaskService.getPrediction(project1),
      flaskService.getPrediction(project2)
    ]);

    if (!res1.success || !res2.success) {
      return res.status(502).json({
        success: false,
        message: 'Failed to get predictions from ML service for comparison',
      });
    }

    const p1Cost = res1.data.cost;
    const p1Time = res1.data.time;
    const p2Cost = res2.data.cost;
    const p2Time = res2.data.time;

    // Calculate percentage difference
    // Formula used: ((p2 - p1) / p1) * 100
    const costPercent = p1Cost === 0 ? 0 : (((p2Cost - p1Cost) / p1Cost) * 100);
    const timePercent = p1Time === 0 ? 0 : (((p2Time - p1Time) / p1Time) * 100);

    res.status(200).json({
      success: true,
      data: {
        project1: { cost: p1Cost, time: p1Time },
        project2: { cost: p2Cost, time: p2Time },
        difference: {
          costPercent: parseFloat(costPercent.toFixed(2)),
          timePercent: parseFloat(timePercent.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during comparison' });
  }
};

module.exports = {
  predictProject,
  getProjectHistory,
  compareProjects,
};
