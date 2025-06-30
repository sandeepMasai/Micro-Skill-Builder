

const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getAllCourses,
  getInstructorCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const router = express.Router();

const upload = multer({ storage });

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/instructor/my-courses', auth, authorize('instructor', 'admin'), getInstructorCourses);
router.post('/', auth, authorize('instructor', 'admin'), upload.single('coverImage'), createCourse);
router.put('/:id', auth, authorize('instructor', 'admin'), upload.single('coverImage'), updateCourse);
router.delete('/:id', auth, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;
