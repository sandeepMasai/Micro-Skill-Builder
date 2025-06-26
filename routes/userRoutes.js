const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getCurrentUser,
  getLeaderboard
} = require('../controllers/userController');

const router = express.Router();

// Get current user profile
router.get('/me', auth, getCurrentUser);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
