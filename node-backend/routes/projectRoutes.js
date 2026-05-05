const express = require('express');
const router = express.Router();
const { predictProject, getProjectHistory, compareProjects } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/predict', protect, predictProject);
router.get('/history', protect, getProjectHistory);
router.post('/compare', protect, compareProjects);

module.exports = router;
