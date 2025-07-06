const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blog');
const ecoSmartRoutes = require('./routes/ecoSmart');
const smartLandRoutes = require('./routes/smartLand');
const galleryRoutes = require('./routes/gallery');

// Import utilities
const { initDB } = require('./utils/initDB');
require('dotenv').config();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || 'https://localhost:3000'
}));
app.use(cookieParser());

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ecosmart', ecoSmartRoutes);
app.use('/api/smartland', smartLandRoutes);
app.use('/api/gallery', galleryRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});