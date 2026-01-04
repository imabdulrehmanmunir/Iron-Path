import Program from '../models/Program.js'
import UserWorkout from '../models/UserWorkout.js'

/**
 * @route   GET /api/programs
 * @desc    Get all available workout programs
 * @access  Public
 */
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().select('-workoutDays')
    res.status(200).json({ programs })
  } catch (error) {
    console.error('Get programs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   GET /api/programs/:id
 * @desc    Get program details with exercises
 * @access  Public
 */
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      'workoutDays.exercises.exerciseId'
    )

    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    res.status(200).json({ program })
  } catch (error) {
    console.error('Get program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   POST /api/programs/:id/select
 * @desc    User selects a workout program
 * @access  Private
 */
export const selectProgram = async (req, res) => {
  try {
    const programId = req.params.id
    console.log(`selectProgram: user ${req.user?.id} selecting program ${programId}`)

    // Check if program exists
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    // Check if user already has an active program
    const existingWorkout = await UserWorkout.findOne({
      userId: req.user.id,
      isActive: true,
    })

    if (existingWorkout) {
      return res.status(400).json({
        message: 'You already have an active program. Finish or cancel it first.',
      })
    }

    // Create new user workout
    const userWorkout = new UserWorkout({
      userId: req.user.id,
      programId: programId,
    })

    await userWorkout.save()
    console.log(`selectProgram: created UserWorkout ${userWorkout._id} for user ${req.user?.id}`)

    res.status(201).json({
      message: 'Program selected successfully',
      userWorkout,
    })
  } catch (error) {
    console.error('Select program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   GET /api/user/current-program
 * @desc    Get user's current active program
 * @access  Private
 */
export const getCurrentProgram = async (req, res) => {
  try {
    console.log(`getCurrentProgram: user ${req.user?.id} requested current program`)
    const userWorkout = await UserWorkout.findOne({
      userId: req.user.id,
      isActive: true,
    }).populate('programId')

    if (!userWorkout) {
      console.log(`getCurrentProgram: no active program for user ${req.user?.id}`)
      return res.status(404).json({ message: 'No active program' })
    }

    res.status(200).json({ userWorkout })
  } catch (error) {
    console.error('Get current program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   POST /api/user/complete-workout
 * @desc    Log completed workout
 * @access  Private
 */
export const completeWorkout = async (req, res) => {
  try {
    const { workoutData } = req.body

    const userWorkout = await UserWorkout.findOne({
      userId: req.user.id,
      isActive: true,
    })

    if (!userWorkout) {
      return res.status(404).json({ message: 'No active program' })
    }

    userWorkout.completedWorkouts.push({
      workoutDate: new Date(),
      ...workoutData,
    })

    await userWorkout.save()

    res.status(200).json({
      message: 'Workout logged successfully',
      userWorkout,
    })
  } catch (error) {
    console.error('Complete workout error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * @route   POST /api/programs/user/cancel
 * @desc    Cancel current program and get summary
 * @access  Private
 */
export const cancelProgram = async (req, res) => {
  try {
    const userId = req.user.id

    const userWorkout = await UserWorkout.findOne({ userId })
    if (!userWorkout) {
      return res.status(404).json({ message: 'No active program found' })
    }

    const program = await Program.findById(userWorkout.programId)

    const summary = {
      programName: program.name,
      programDuration: program.duration,
      daysPerWeek: program.daysPerWeek,
      totalWorkoutDays: program.workoutDays.length,
      workoutsCompleted: userWorkout.completedWorkouts.length,
      weeksCompleted: userWorkout.currentWeek,
      startDate: userWorkout.startDate,
      endDate: new Date(),
      totalVolume: userWorkout.completedWorkouts.reduce((sum, w) => {
        return sum + (w.totalSets || 0)
      }, 0),
    }

    // Clear the active program
    await UserWorkout.deleteOne({ userId })

    res.status(200).json({
      message: 'Program cancelled successfully',
      summary,
    })
  } catch (error) {
    console.error('Cancel program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
