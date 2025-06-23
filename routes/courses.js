const express = require('express');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});



// Get all published courses

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .select('-days.content')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get instructor's courses Private (Instructor only)
  
router.get('/instructor/my-courses', [auth, authorize('instructor', 'admin')], async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get course by ID

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Create new course Private (Instructor only)
  
router.post('/', [auth, authorize('instructor', 'admin')], upload.single('coverImage'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const courseData = {
      title,
      description,
      instructor: req.user._id,
      days: []
    };

    if (req.file) {
      courseData.coverImage = `/uploads/courses/${req.file.filename}`;
    }

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


//  Update course Private (Instructor only)

router.put('/:id', [auth, authorize('instructor', 'admin')], upload.single('coverImage'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const { title, description, days, isPublished } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (days) course.days = JSON.parse(days);
    if (typeof isPublished === 'boolean') course.isPublished = isPublished;

    if (req.file) {
      course.coverImage = `/uploads/courses/${req.file.filename}`;
    }

    await course.save();

    const updatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name');

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete course Private (Instructor only)

router.delete('/:id', [auth, authorize('instructor', 'admin')], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
