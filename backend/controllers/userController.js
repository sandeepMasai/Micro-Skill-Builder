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

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = {};

    // Update name if provided
    if (name) {
      updateData.name = name.trim();
    }

    // Update bio if provided
    if (bio !== undefined) {
      updateData.bio = bio.trim();
    }

    // Update avatar if file was uploaded
    if (req.file && req.file.path) {
      updateData.avatar = req.file.path;
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ error: messages });
    }

    res.status(500).json({ 
      error: 'Server error while updating profile',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get XP leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name xp badges avatar')
      .sort({ xp: -1 })
      .limit(10);

    res.json({ leaderboard: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
