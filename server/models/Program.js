import mongoose from 'mongoose'

const workoutDaySchema = new mongoose.Schema({
  dayName: {
    type: String,
    required: true, // e.g., "Chest & Triceps", "Back & Biceps"
  },
  dayNumber: Number, // 1-6 for which day of the week
  exercises: [
    {
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      sets: {
        type: Number,
        required: true, // e.g., 3, 4, 5
      },
      reps: {
        type: String,
        required: true, // e.g., "8-10", "10-12", "6-8"
      },
      restSeconds: {
        type: Number,
        default: 90, // Rest between sets
      },
      notes: String,
    },
  ],
})

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g., "Bro Split", "Push/Pull/Legs"
    },
    description: String,
    daysPerWeek: {
      type: Number,
      required: true, // 3, 4, 5, 6 days
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    duration: {
      type: String, // e.g., "8 weeks", "12 weeks"
      default: '12 weeks',
    },
    goal: {
      type: String,
      enum: ['Strength', 'Hypertrophy', 'Endurance', 'Mixed'],
      default: 'Hypertrophy',
    },
    workoutDays: [workoutDaySchema],
    image: String, // URL to program image
    bestFor: String, // Description of who this program is best for
  },
  { timestamps: true }
)

export default mongoose.model('Program', programSchema)
