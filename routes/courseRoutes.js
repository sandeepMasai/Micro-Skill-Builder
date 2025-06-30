// const express = require('express');
// const { auth, authorize } = require('../middleware/auth');
// const {
//   getAllCourses,
//   getInstructorCourses,
//   getCourseById,
//   createCourse,
//   updateCourse,
//   deleteCourse
// } = require('../controllers/courseController');
// const multer = require('multer');
// const path = require('path');

// const router = express.Router();

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/courses/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 500 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   }
// });

// // Public
// router.get('/', getAllCourses);
// router.get('/:id', getCourseById);

// // Instructor/Admin only
// router.get('/instructor/my-courses', auth, authorize('instructor', 'admin'), getInstructorCourses);
// router.post('/', auth, authorize('instructor', 'admin'), upload.single('coverImage'), createCourse);
// router.put('/:id', auth, authorize('instructor', 'admin'), upload.single('coverImage'), updateCourse);
// router.delete('/:id', auth, authorize('instructor', 'admin'), deleteCourse);

// module.exports = router;

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
