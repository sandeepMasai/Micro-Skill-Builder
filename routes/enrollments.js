const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { awardXP, BADGES } = require('../utils/gamification');
const router = express.Router();


//  Enroll in a course
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ error: 'Course not found or not published' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      userId: req.user._id,
      courseId
    });

    await enrollment.save();

    // Update user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        enrolledCourses: {
          courseId,
          progress: 0
        }
      }
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    // Award "First Steps" badge if this is their first enrollment
    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.length === 1 && !user.badges.includes(BADGES.FIRST_STEPS)) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { badges: BADGES.FIRST_STEPS }
      });
    }

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('courseId', 'title description coverImage');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//  Update course progress
router.patch('/progress', auth, async (req, res) => {
  try {
    const { courseId, dayNumber, completed } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (completed && !enrollment.completedDays.includes(dayNumber)) {
      enrollment.completedDays.push(dayNumber);
      
      await awardXP(req.user._id, 'COMPLETE_DAY');
    }

    // Calculate progress percentage
    enrollment.progress = (enrollment.completedDays.length / 5) * 100;

    // Check if course is completed
    if (enrollment.progress === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedDate = new Date();
      
      // Award completion XP and badge
      await awardXP(req.user._id, 'COMPLETE_COURSE');
      
      const user = await User.findById(req.user._id);
      if (!user.badges.includes(BADGES.FINISHER)) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { badges: BADGES.FINISHER }
        });
      }
    }

    await enrollment.save();

    // Update user's enrolled courses progress
    await User.findOneAndUpdate(
      { _id: req.user._id, 'enrolledCourses.courseId': courseId },
      { $set: { 'enrolledCourses.$.progress': enrollment.progress } }
    );

    res.json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//  Get user's enrollments
router.get('/my-enrollments', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId', 'title description coverImage instructor')
      .populate('courseId.instructor', 'name')
      .sort({ createdAt: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
