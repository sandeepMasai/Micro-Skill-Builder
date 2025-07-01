const User = require('../models/User');

const XP_REWARDS = {
  COMPLETE_DAY: 10,
  PASS_QUIZ: 5,
  SUBMIT_REVIEW: 3,
  RECEIVE_POSITIVE_REVIEW: 2,
  COMPLETE_COURSE: 50
};

const BADGES = {
  FIRST_STEPS: 'First Steps',
  FINISHER: 'Finisher',
  TOP_REVIEWER: 'Top Reviewer',
  XP_MASTER: 'XP Master',
  SPEED_LEARNER: 'Speed Learner'
};

const awardXP = async (userId, action) => {
  try {
    const xpAmount = XP_REWARDS[action] || 0;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { xp: xpAmount } },
      { new: true }
    );

    // Check for new badges
    await checkForNewBadges(user);
    
    return { xpAwarded: xpAmount, totalXP: user.xp };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return null;
  }
};

const checkForNewBadges = async (user) => {
  const newBadges = [];

  // XP Master badge
  if (user.xp >= 500 && !user.badges.includes(BADGES.XP_MASTER)) {
    newBadges.push(BADGES.XP_MASTER);
  }

  // Add new badges
  if (newBadges.length > 0) {
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { badges: { $each: newBadges } }
    });
  }

  return newBadges;
};

module.exports = {
  awardXP,
  checkForNewBadges,
  XP_REWARDS,
  BADGES
};