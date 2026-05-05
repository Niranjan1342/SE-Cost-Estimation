const mongoose = require('mongoose');

const projectHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inputData: {
    type: Object,
    required: true,
  },
  predictedCost: {
    type: Number,
    required: true,
  },
  predictedTime: {
    type: Number,
    required: true,
  },
  featureImportance: {
    type: Array,
  },
  whatIfAnalysis: {
    type: Array,
  },
}, { timestamps: true });

module.exports = mongoose.model('ProjectHistory', projectHistorySchema);
