
const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();


// Get current user profile with stats
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

// Get XP leaderboard

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name xp badges avatar')
      .sort({ xp: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;