// const Course = require('../models/Course');
// const path = require('path');

// // Get all published courses
// exports.getAllCourses = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, category } = req.query;
//     const query = { isPublished: true };

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (category) {
//       query.category = category;
//     }

//     const courses = await Course.find(query)
//       .populate('instructor', 'name')
//       .select('-days.content')
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await Course.countDocuments(query);

//     res.json({
//       courses,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page),
//       total
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get instructor's courses
// exports.getInstructorCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
//     res.json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Get course by ID
// exports.getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id).populate('instructor', 'name avatar');

//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     res.json(course);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Create new course

// exports.createCourse = async (req, res) => {
//   try {
//     const { title, description, category, days } = req.body;

//     if (!title || !description || !category) {
//       return res.status(400).json({ error: 'Title, description, and category are required' });
//     }

//     let parsedDays = [];
//     if (days) {
//       parsedDays = typeof days === 'string' ? JSON.parse(days) : days;

//       if (parsedDays.length > 5) {
//         return res.status(400).json({ error: 'Course cannot have more than 5 days' });
//       }
//     }

//     const courseData = {
//       title,
//       description,
//       category,
//       instructor: req.user._id,
//       days: parsedDays
//     };

//     if (req.file) {
//       courseData.coverImage = `/uploads/courses/${req.file.filename}`;
//     }

//     const course = new Course(courseData);
//     await course.save();

//     const populatedCourse = await Course.findById(course._id).populate('instructor', 'name');
//     res.status(201).json(populatedCourse);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// // Update course
// exports.updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) return res.status(404).json({ error: 'Course not found' });

//     if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Not authorized' });
//     }

//     const { title, description, days, isPublished, category } = req.body;

//     if (title) course.title = title;
//     if (description) course.description = description;
//     if (category) course.category = category;
//     if (days) course.days = JSON.parse(days);
//     if (typeof isPublished === 'boolean') course.isPublished = isPublished;

//     if (req.file) {
//       course.coverImage = `/uploads/courses/${req.file.filename}`;
//     }

//     await course.save();
//     const updatedCourse = await Course.findById(course._id).populate('instructor', 'name');
//     res.json(updatedCourse);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Delete course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) return res.status(404).json({ error: 'Course not found' });

//     if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Not authorized' });
//     }

//     await course.deleteOne();
//     res.json({ message: 'Course deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
const Course = require('../models/Course');
const path = require('path');

// Get all published courses
exports.getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name')
      .populate('category', 'name')
      .select('-days.content')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .populate('category', 'name');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('category', 'name');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, days } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    let parsedDays = [];
    if (days) {
      parsedDays = typeof days === 'string' ? JSON.parse(days) : days;

      if (parsedDays.length > 5) {
        return res.status(400).json({ error: 'Course cannot have more than 5 days' });
      }
    }

    const courseData = {
      title,
      description,
      category,
      instructor: req.user._id,
      days: parsedDays
    };

    if (req.file) {
      courseData.coverImage = `/uploads/courses/${req.file.filename}`;
    }

    const course = new Course(courseData);
    await course.save();

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name')
      .populate('category', 'name');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, days, isPublished, category } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (days) course.days = JSON.parse(days);
    if (typeof isPublished === 'boolean') course.isPublished = isPublished;

    if (req.file) {
      course.coverImage = `/uploads/courses/${req.file.filename}`;
    }

    await course.save();
    const updatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name')
      .populate('category', 'name');

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
