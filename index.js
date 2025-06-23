const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const moduleRoutes = require('./routes/modules');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/users', userRoutes);
//email
app.use('/api/contact', contactRoutes);


// start route is running
app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', message: 'SkillForge API is running!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
