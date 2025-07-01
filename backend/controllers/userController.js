const User = require('../models/User');

// Get current user profile with stats
exports.getCurrentUser = async (req, res) => {
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

// Get XP leaderboard
exports.getLeaderboard = async (req, res) => {
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
};
