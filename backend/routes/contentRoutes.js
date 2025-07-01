const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getDayContent,
  submitQuizAnswer
} = require('../controllers/contentController');

const router = express.Router();

router.get('/:courseId/day/:dayNumber', auth, getDayContent);
router.post('/:courseId/day/:dayNumber/quiz', auth, submitQuizAnswer);

module.exports = router;
