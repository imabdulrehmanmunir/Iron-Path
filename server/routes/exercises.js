import express from 'express'
import {
  getAllExercises,
  getExerciseById,
  getExercisesByCategory,
} from '../controllers/exerciseController.js'

const router = express.Router()

// @route   GET /api/exercises
// @desc    Get all exercises with optional filters
// @access  Public
router.get('/', getAllExercises)

// @route   GET /api/exercises/:id
// @desc    Get exercise details
// @access  Public
router.get('/:id', getExerciseById)

// @route   GET /api/exercises/category/:category
// @desc    Get exercises by category
// @access  Public
router.get('/category/:category', getExercisesByCategory)

export default router
