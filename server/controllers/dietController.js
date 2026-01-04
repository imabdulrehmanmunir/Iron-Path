import Diet from '../models/Diet.js'
import User from '../models/User.js'
import { calculateMacros } from '../utils/calculateMacros.js'

export const createDiet = async (req, res) => {
  try {
    const { goal } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.tdee || !user.weight) {
      return res
        .status(400)
        .json({ message: 'Complete onboarding first to set up diet' })
    }

    const goalLowercase = (goal || user.goal || 'maintain').toLowerCase()
    const macroTargets = calculateMacros(user.tdee, goalLowercase, user.weight)

    let existingDiet = await Diet.findOne({ userId })

    if (existingDiet) {
      existingDiet.goal = goalLowercase
      existingDiet.dailyCalories = user.tdee
      existingDiet.macroTargets = macroTargets
      existingDiet.mealsToday = []
      await existingDiet.save()
      return res.status(200).json(existingDiet)
    }

    const newDiet = new Diet({
      userId,
      goal: goalLowercase,
      dailyCalories: user.tdee,
      macroTargets,
    })

    await newDiet.save()
    res.status(201).json(newDiet)
  } catch (error) {
    console.error('createDiet error:', error)
    res.status(500).json({ message: 'Failed to create diet', error: error.message })
  }
}

export const getCurrentDiet = async (req, res) => {
  try {
    const userId = req.user.id

    let diet = await Diet.findOne({ userId })

    if (!diet) {
      const user = await User.findById(userId)
      if (!user || !user.tdee || !user.weight) {
        return res
          .status(404)
          .json({ message: 'Complete onboarding to access diet tracker' })
      }

      const macroTargets = calculateMacros(user.tdee, user.goal || 'maintain', user.weight)
      diet = new Diet({
        userId,
        goal: user.goal || 'maintain',
        dailyCalories: user.tdee,
        macroTargets,
        mealsToday: [],
      })
      await diet.save()
    }

    const mealsArray = diet.mealsToday || []
    const todayMeals = mealsArray.filter((meal) => {
      const mealDate = new Date(meal.timestamp)
      const today = new Date()
      return (
        mealDate.getFullYear() === today.getFullYear() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getDate() === today.getDate()
      )
    })

    const totals = {
      calories: todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
      protein: todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
      carbs: todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
      fats: todayMeals.reduce((sum, meal) => sum + (meal.fats || 0), 0),
    }

    res.status(200).json({
      ...diet.toObject(),
      mealsToday: todayMeals,
      totalsToday: totals,
    })
  } catch (error) {
    console.error('getCurrentDiet error:', error)
    res.status(500).json({ message: 'Failed to load diet data', error: error.message })
  }
}

// dietType toggle removed — single normal diet supported

export const trackMeal = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, calories, protein, carbs, fats } = req.body

    if (!name || !calories) {
      return res
        .status(400)
        .json({ message: 'Meal name and calories are required' })
    }

    let diet = await Diet.findOne({ userId })
    if (!diet) {
      return res.status(404).json({ message: 'Diet not found' })
    }

    if (!diet.mealsToday) {
      diet.mealsToday = []
    }

    diet.mealsToday.push({
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      timestamp: new Date(),
    })

    await diet.save()

    const mealsArray = diet.mealsToday || []
    const todayMeals = mealsArray.filter((meal) => {
      const mealDate = new Date(meal.timestamp)
      const today = new Date()
      return (
        mealDate.getFullYear() === today.getFullYear() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getDate() === today.getDate()
      )
    })

    const totals = {
      calories: todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
      protein: todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
      carbs: todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
      fats: todayMeals.reduce((sum, meal) => sum + (meal.fats || 0), 0),
    }

    res.status(201).json({
      ...diet.toObject(),
      mealsToday: todayMeals,
      totalsToday: totals,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
