const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//Register new user

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'student'
    });

    await user.save();

    // Send welcome email (non-blocking - don't fail registration if email fails)
    sendEmail(
      user.email,
      'Welcome to SkillForge!',
      `<h2>Hi ${user.name},</h2><p>Thanks for joining <strong>SkillForge</strong> 🚀<br/>Let your learning journey begin!</p>`
    ).catch(err => {
      console.error('Failed to send welcome email:', err.message);
      // Don't throw - registration should succeed even if email fails
    });

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ error: messages });
    }
    
    res.status(500).json({ 
      error: 'Server error during registration',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

//  Get current logged-in user

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title description coverImage');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
