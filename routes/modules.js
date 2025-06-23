const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth } = require('../middleware/auth');
const { awardXP } = require('../utils/gamification');
const router = express.Router();

// Get module content for specific day
router.get('/:courseId/day/:dayNumber', auth, async (req, res) => {
  try {
    const { courseId, dayNumber } = req.params;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to access this content' });
    }

    // Get course and specific day content
    const course = await Course.findById(courseId)
      .populate('instructor', 'name avatar');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const dayContent = course.days.find(day => day.dayNumber === parseInt(dayNumber));

    if (!dayContent) {
      return res.status(404).json({ error: 'Day content not found' });
    }

    // Check if this day is accessible (sequential access)
    const currentDay = parseInt(dayNumber);
    const completedDays = enrollment.completedDays;
    
    // User can access day 1 immediately, or any day after completing the previous one
    if (currentDay > 1 && !completedDays.includes(currentDay - 1)) {
      return res.status(403).json({ 
        error: 'You must complete the previous day before accessing this content' 
      });
    }

    res.json({
      course: {
        id: course._id,
        title: course.title,
        instructor: course.instructor
      },
      dayContent,
      userProgress: {
        completedDays: enrollment.completedDays,
        progress: enrollment.progress,
        isCurrentDayCompleted: completedDays.includes(currentDay)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz answer
router.post('/:courseId/day/:dayNumber/quiz', auth, async (req, res) => {
  try {
    const { courseId, dayNumber } = req.params;
    const { selectedAnswer } = req.body;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to submit quiz answers' });
    }

    // Get course and quiz data
    const course = await Course.findById(courseId);
    const dayContent = course.days.find(day => day.dayNumber === parseInt(dayNumber));
    
    if (!dayContent || !dayContent.content.quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = dayContent.content.quiz;
    const isCorrect = quiz.correctAnswer === selectedAnswer;

    // Award XP for correct answer
    if (isCorrect) {
      await awardXP(req.user._id, 'PASS_QUIZ');
    }

    res.json({
      correct: isCorrect,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation || null,
      xpAwarded: isCorrect ? 5 : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;