const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// dotenv variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://micro-skill-builder-frontend.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      callback(null, true);
    } else {
      // In production, log and allow (for flexibility)
      console.log(`CORS: Allowing origin: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', message: 'SkillForge API is running!' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
