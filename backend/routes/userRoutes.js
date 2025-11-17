const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const {
  getCurrentUser,
  updateProfile,
  getLeaderboard
} = require('../controllers/userController');
const { avatarStorage } = require('../utils/cloudinary');

const router = express.Router();

const upload = multer({ 
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get current user profile
router.get('/me', auth, getCurrentUser);

// Update current user profile
router.patch('/me', auth, upload.single('avatar'), (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    if (err.message === 'Only image files are allowed') {
      return res.status(400).json({ error: 'Only image files are allowed.' });
    }
    return res.status(400).json({ error: err.message || 'File upload error' });
  }
  next();
}, updateProfile);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
