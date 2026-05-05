require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Node.js Express API is running' });
});

// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Node backend server running on port ${PORT}`);
});
