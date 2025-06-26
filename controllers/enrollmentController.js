const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { awardXP, BADGES } = require('../utils/gamification');

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ error: 'Course ID is required' });

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ error: 'Course not found or not published' });
    }

    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({ userId: req.user._id, courseId });
    await enrollment.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: { courseId, progress: 0 } }
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.length === 1 && !user.badges.includes(BADGES.FIRST_STEPS)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { badges: BADGES.FIRST_STEPS }
      });
    }

    const populated = await Enrollment.findById(enrollment._id)
      .populate('courseId', 'title description coverImage');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, dayNumber, completed } = req.body;

    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    if (completed && !enrollment.completedDays.includes(dayNumber)) {
      enrollment.completedDays.push(dayNumber);
      await awardXP(req.user._id, 'COMPLETE_DAY');
    }

    // Assume 5 total days for simplicity; ideally use dynamic course length
    enrollment.progress = (enrollment.completedDays.length / 5) * 100;

    if (enrollment.progress === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedDate = new Date();

      await awardXP(req.user._id, 'COMPLETE_COURSE');

      const user = await User.findById(req.user._id);
      if (!user.badges.includes(BADGES.FINISHER)) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { badges: BADGES.FINISHER }
        });
      }
    }

    await enrollment.save();

    await User.findOneAndUpdate(
      { _id: req.user._id, 'enrolledCourses.courseId': courseId },
      { $set: { 'enrolledCourses.$.progress': enrollment.progress } }
    );

    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all enrollments for current user
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId', 'title description coverImage instructor')
      .populate('courseId.instructor', 'name')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
