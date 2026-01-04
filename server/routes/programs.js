import express from 'express'
import {
  getAllPrograms,
  getProgramById,
  selectProgram,
  getCurrentProgram,
  completeWorkout,
  cancelProgram,
} from '../controllers/programController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   GET /api/programs
// @desc    Get all workout programs
// @access  Public
router.get('/', getAllPrograms)

// IMPORTANT: Routes with /user must come BEFORE /:id to avoid ID collision
// @route   GET /api/programs/user/current
// @desc    Get user's current program
// @access  Private
router.get('/user/current', authMiddleware, getCurrentProgram)

// @route   POST /api/programs/user/complete
// @desc    Log completed workout
// @access  Private
router.post('/user/complete', authMiddleware, completeWorkout)

// @route   POST /api/programs/user/cancel
// @desc    Cancel current program
// @access  Private
router.post('/user/cancel', authMiddleware, cancelProgram)

// @route   GET /api/programs/:id
// @desc    Get program details
// @access  Public
router.get('/:id', getProgramById)

// @route   POST /api/programs/:id/select
// @desc    User selects a program
// @access  Private
router.post('/:id/select', authMiddleware, selectProgram)

export default router
