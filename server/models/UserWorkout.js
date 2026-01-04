import mongoose from 'mongoose'

const userWorkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    currentWeek: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    completedWorkouts: [
      {
        workoutDate: Date,
        dayName: String,
        exercises: [
          {
            exerciseName: String,
            setsCompleted: Number,
            repsPerSet: [String], // Stores rep ranges like "8-10", "10-12", etc.
            weight: [Number], // Weight used for each set
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('UserWorkout', userWorkoutSchema)
