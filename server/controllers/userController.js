import User from '../models/User.js'
import Diet from '../models/Diet.js'
import { calculateBMR, calculateTDEE } from '../utils/calculateBMR.js'
import { calculateMacros } from '../utils/calculateMacros.js'

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   PUT /api/user/onboard
 * @desc    Complete onboarding (collect physical stats & calculate BMR/TDEE)
 * @access  Private
 */
export const onboard = async (req, res) => {
  try {
    const { age, weight, height, gender, activityLevel, goal } = req.body

    // Validation
    if (!age || !weight || !height || !gender || !activityLevel || !goal) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate ranges
    if (age < 13 || age > 120) {
      return res.status(400).json({ message: 'Age must be between 13 and 120' })
    }

    if (weight < 30 || weight > 300) {
      return res.status(400).json({ message: 'Weight must be between 30kg and 300kg' })
    }

    if (height < 100 || height > 250) {
      return res.status(400).json({ message: 'Height must be between 100cm and 250cm' })
    }

    // Calculate BMR and TDEE
    const bmr = calculateBMR(weight, height, age, gender)
    const tdee = calculateTDEE(bmr, activityLevel)

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        age,
        weight,
        height,
        gender,
        activityLevel,
        goal,
        bmr,
        tdee,
        onboardingCompleted: true,
      },
      { new: true }
    ).select('-password')

    // Auto-create diet for the user if not exists (single normal diet)
    try {
      const macroTargets = calculateMacros(tdee, goal || 'maintain', weight)
      let existingDiet = await Diet.findOne({ userId: req.user.id })
      if (existingDiet) {
        existingDiet.goal = (goal || existingDiet.goal || 'maintain').toLowerCase()
        existingDiet.dailyCalories = tdee
        existingDiet.macroTargets = macroTargets
        await existingDiet.save()
      } else {
        const newDiet = new Diet({
          userId: req.user.id,
          goal: (goal || 'maintain').toLowerCase(),
          dailyCalories: tdee,
          macroTargets,
          mealsToday: [],
        })
        await newDiet.save()
      }
    } catch (dietErr) {
      console.error('Auto-create diet error:', dietErr)
    }

    res.status(200).json({
      message: 'Onboarding completed successfully',
      user,
    })
  } catch (error) {
    console.error('Onboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   PATCH /api/user/profile
 * @desc    Update user profile (weight, height, age, activityLevel)
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { age, weight, height, gender, activityLevel, goal } = req.body

    // Validation
    const updates = {}

    if (age !== undefined) {
      if (age < 13 || age > 120) {
        return res.status(400).json({ message: 'Age must be between 13 and 120' })
      }
      updates.age = age
    }

    if (weight !== undefined) {
      if (weight < 30 || weight > 300) {
        return res.status(400).json({ message: 'Weight must be between 30kg and 300kg' })
      }
      updates.weight = weight
    }

    if (height !== undefined) {
      if (height < 100 || height > 250) {
        return res.status(400).json({ message: 'Height must be between 100cm and 250cm' })
      }
      updates.height = height
    }

    if (gender !== undefined) {
      updates.gender = gender
    }

    if (activityLevel !== undefined) {
      updates.activityLevel = activityLevel
    }

    if (goal !== undefined) {
      updates.goal = goal
    }

    // Recalculate BMR and TDEE if weight, height, age, or activityLevel changed
    const user = await User.findById(req.user.id)
    const newWeight = weight !== undefined ? weight : user.weight
    const newHeight = height !== undefined ? height : user.height
    const newAge = age !== undefined ? age : user.age
    const newGender = gender !== undefined ? gender : user.gender
    const newActivityLevel = activityLevel !== undefined ? activityLevel : user.activityLevel

    const bmr = calculateBMR(newWeight, newHeight, newAge, newGender)
    const tdee = calculateTDEE(bmr, newActivityLevel)

    updates.bmr = bmr
    updates.tdee = tdee

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select('-password')

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   DELETE /api/user
 * @desc    Delete user account and all related data
 * @access  Private
 */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id

    // Delete user and cascade delete related data
    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Also delete related records
    // These can be done with cascade delete in MongoDB or manually
    // For now, we'll just delete the user record

    res.status(200).json({
      message: 'User account deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
