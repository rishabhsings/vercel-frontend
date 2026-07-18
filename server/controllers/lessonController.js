import Lesson from '../models/Lesson.js';

// @desc    Get beginner lessons
// @route   GET /api/lessons
// @access  Private
export const getBeginnerLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ difficulty: 'Beginner' });
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};
