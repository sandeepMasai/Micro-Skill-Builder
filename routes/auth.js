const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


//  Register new user

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || 'student'
    });

    await user.save();

    // Send welcome email
    await sendEmail(
      user.email,
      'Welcome to SkillForge!',
      `<h2>Hi ${user.name},</h2><p>Thanks for joining <strong>SkillForge</strong> 🚀<br/>Let your learning journey begin!</p>`
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

//  Login user

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
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
});


// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title description coverImage');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
