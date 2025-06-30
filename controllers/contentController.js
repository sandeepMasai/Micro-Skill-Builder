const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { awardXP } = require('../utils/gamification');

// courseId/day/:dayNumber 
exports.getDayContent = async (req, res) => {
  try {
    const { courseId, dayNumber } = req.params;
    const currentDay = parseInt(dayNumber);

    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to access this content' });
    }

    const course = await Course.findById(courseId).populate('instructor', 'name avatar');
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const dayContent = course.days.find(day => day.dayNumber === currentDay);
    if (!dayContent) return res.status(404).json({ error: 'Day content not found' });

    // Sequential access check
    const completedDays = enrollment.completedDays;
    if (currentDay > 1 && !completedDays.includes(currentDay - 1)) {
      return res.status(403).json({ error: 'Complete the previous day first' });
    }

    res.json({
      course: {
        id: course._id,
        title: course.title,
        instructor: course.instructor
      },
      dayContent,
      userProgress: {
        completedDays,
        progress: enrollment.progress,
        isCurrentDayCompleted: completedDays.includes(currentDay)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// courseId/day/:dayNumber/quiz — Submit quiz answer
exports.submitQuizAnswer = async (req, res) => {
  try {
    const { courseId, dayNumber } = req.params;
    const { selectedAnswer } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled to submit quiz answers' });
    }

    const course = await Course.findById(courseId);
    const dayContent = course.days.find(day => day.dayNumber === parseInt(dayNumber));

    if (!dayContent || !dayContent.content.quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = dayContent.content.quiz;
    const isCorrect = quiz.correctAnswer === selectedAnswer;

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
};
