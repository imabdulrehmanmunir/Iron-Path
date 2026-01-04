import express from 'express'
import {
  createDiet,
  getCurrentDiet,
  trackMeal,
} from '../controllers/dietController.js'
import {authMiddleware} from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/diet', authMiddleware, createDiet)
router.get('/diet', authMiddleware, getCurrentDiet)
// diet type route removed; single normal diet supported
router.post('/diet/meal', authMiddleware, trackMeal)

export default router
