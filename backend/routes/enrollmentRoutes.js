const express = require('express');
const { auth } = require('../middleware/auth');
const {
  enrollInCourse,
  updateProgress,
  getMyEnrollments
} = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/', auth, enrollInCourse);
router.patch('/progress', auth, updateProgress);
router.get('/my-enrollments', auth, getMyEnrollments);

module.exports = router;
