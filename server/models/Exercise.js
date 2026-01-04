import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'],
    required: true,
  },
  muscleGroup: {
    type: String,
    enum: [
      'Chest',
      'Back',
      'Quadriceps',
      'Hamstrings',
      'Glutes',
      'Calves',
      'Shoulders',
      'Biceps',
      'Triceps',
      'Forearms',
      'Abs',
      'Obliques',
    ],
    required: true,
  },
  description: String,
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate',
  },
  equipment: [String], // e.g., ["Barbell", "Dumbbell", "Machine"]
  instructions: String,
  videoUrl: String,
})

export default mongoose.model('Exercise', exerciseSchema)
