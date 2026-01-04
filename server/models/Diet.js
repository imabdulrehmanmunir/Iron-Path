import mongoose from 'mongoose'

const DietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dietType: {
      // removed dietType: only a single normal diet is supported now
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    macroTargets: {
      protein: {
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        target: {
          type: Number,
          required: true,
        },
      },
      carbs: {
        type: Number,
        required: true,
      },
      fats: {
        type: Number,
        required: true,
      },
    },
    mealsToday: [
      {
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    goal: {
      type: String,
      enum: ['bulk', 'cut', 'maintain'],
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Diet', DietSchema)
