import Exercise from '../models/Exercise.js'

/**
 * @route   GET /api/exercises
 * @desc    Get all exercises with filters
 * @access  Public
 */
export const getAllExercises = async (req, res) => {
  try {
    const { category, muscleGroup, difficulty } = req.query
    const filter = {}

    if (category) filter.category = category
    if (muscleGroup) filter.muscleGroup = muscleGroup
    if (difficulty) filter.difficulty = difficulty

    const exercises = await Exercise.find(filter)
    res.status(200).json({ exercises })
  } catch (error) {
    console.error('Get exercises error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   GET /api/exercises/:id
 * @desc    Get exercise details
 * @access  Public
 */
export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id)

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' })
    }

    res.status(200).json({ exercise })
  } catch (error) {
    console.error('Get exercise error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   GET /api/exercises/category/:category
 * @desc    Get exercises by category
 * @access  Public
 */
export const getExercisesByCategory = async (req, res) => {
  try {
    const exercises = await Exercise.find({ category: req.params.category })

    if (exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found for this category' })
    }

    res.status(200).json({ exercises })
  } catch (error) {
    console.error('Get exercises by category error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
