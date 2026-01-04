import express from 'express'
import { getProfile, onboard, updateProfile, deleteUser } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile)

// @route   PUT /api/user/onboard
// @desc    Complete onboarding (collect physical stats & calculate BMR/TDEE)
// @access  Private
router.put('/onboard', authMiddleware, onboard)

// @route   PATCH /api/user/profile
// @desc    Update user profile
// @access  Private
router.patch('/profile', authMiddleware, updateProfile)

// @route   DELETE /api/user
// @desc    Delete user account
// @access  Private
router.delete('/', authMiddleware, deleteUser)

export default router
