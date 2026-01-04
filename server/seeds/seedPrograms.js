import mongoose from 'mongoose'
import Program from '../models/Program.js'
import Exercise from '../models/Exercise.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitness-app'

// Exercise definitions for all splits
const exercisesData = [
  // Bro Split - Chest Day
  { name: 'Barbell Bench Press', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: ['Barbell', 'Bench'] },
  { name: 'Incline Dumbbell Press', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: ['Dumbbell', 'Bench'] },
  { name: 'Cable Flyes', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: ['Cable Machine'] },
  { name: 'Dips', category: 'Chest', muscleGroup: 'Triceps', difficulty: 'Intermediate', equipment: ['Dip Station'] },
  { name: 'Cable Crossover', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: ['Cable Machine'] },

  // Bro Split - Back Day
  { name: 'Deadlift', category: 'Back', muscleGroup: 'Back', difficulty: 'Advanced', equipment: ['Barbell'] },
  { name: 'Pull-ups', category: 'Back', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: ['Pull-up Bar'] },
  { name: 'Barbell Rows', category: 'Back', muscleGroup: 'Back', difficulty: 'Advanced', equipment: ['Barbell'] },
  { name: 'Seal Chest Rows', category: 'Back', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: ['Bench', 'Dumbbell'] },
  { name: 'Dumbbell Rows', category: 'Back', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: ['Dumbbell', 'Bench'] },

  // Bro Split - Shoulder Day
  { name: 'Overhead Press', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Intermediate', equipment: ['Barbell'] },
  { name: 'Lateral Raises', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: ['Dumbbell'] },
  { name: 'Front Raises', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: ['Dumbbell'] },
  { name: 'Reverse Dumbbell Flyes', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: ['Dumbbell'] },
  { name: 'Shrugs', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: ['Barbell', 'Dumbbell'] },

  // Bro Split - Arm Day
  { name: 'Barbell Curls', category: 'Arms', muscleGroup: 'Biceps', difficulty: 'Intermediate', equipment: ['Barbell'] },
  { name: 'Dumbbell Curls', category: 'Arms', muscleGroup: 'Biceps', difficulty: 'Beginner', equipment: ['Dumbbell'] },
  { name: 'Tricep Pushdowns', category: 'Arms', muscleGroup: 'Triceps', difficulty: 'Beginner', equipment: ['Cable Machine'] },
  { name: 'Skull Crushers', category: 'Arms', muscleGroup: 'Triceps', difficulty: 'Intermediate', equipment: ['Dumbbell', 'Bench'] },
  { name: 'Hammer Curls', category: 'Arms', muscleGroup: 'Biceps', difficulty: 'Beginner', equipment: ['Dumbbell'] },

  // Bro Split - Leg Day
  { name: 'Barbell Squats', category: 'Legs', muscleGroup: 'Quadriceps', difficulty: 'Advanced', equipment: ['Barbell', 'Rack'] },
  { name: 'Leg Press', category: 'Legs', muscleGroup: 'Quadriceps', difficulty: 'Beginner', equipment: ['Machine'] },
  { name: 'Romanian Deadlifts', category: 'Legs', muscleGroup: 'Hamstrings', difficulty: 'Intermediate', equipment: ['Barbell'] },
  { name: 'Leg Curls', category: 'Legs', muscleGroup: 'Hamstrings', difficulty: 'Beginner', equipment: ['Machine'] },
  { name: 'Calf Raises', category: 'Legs', muscleGroup: 'Calves', difficulty: 'Beginner', equipment: ['Machine', 'Barbell'] },

  // Full Body Split - Additional exercises
  { name: 'Smith Machine Bench Press', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: ['Smith Machine'] },
  { name: 'Machine Leg Press', category: 'Legs', muscleGroup: 'Quadriceps', difficulty: 'Beginner', equipment: ['Machine'] },
  { name: 'Assisted Pull-ups', category: 'Back', muscleGroup: 'Back', difficulty: 'Beginner', equipment: ['Machine'] },
  { name: 'Machine Chest Press', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: ['Machine'] },
  { name: 'Leg Extensions', category: 'Legs', muscleGroup: 'Quadriceps', difficulty: 'Beginner', equipment: ['Machine'] },

  // PPL Split - Additional exercises
  { name: 'Incline Barbell Press', category: 'Chest', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: ['Barbell', 'Bench'] },
  { name: 'Face Pulls', category: 'Shoulders', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: ['Cable Machine'] },
  { name: 'Cable Rows', category: 'Back', muscleGroup: 'Back', difficulty: 'Beginner', equipment: ['Cable Machine'] },
  { name: 'Weighted Dips', category: 'Chest', muscleGroup: 'Triceps', difficulty: 'Advanced', equipment: ['Dip Station'] },
  { name: 'Machine Rows', category: 'Back', muscleGroup: 'Back', difficulty: 'Beginner', equipment: ['Machine'] },
]

const programsData = [
  {
    name: 'Bro Split',
    description: 'Classic bodybuilding split - One muscle group per day for maximum volume and focus',
    daysPerWeek: 5,
    difficulty: 'Intermediate',
    duration: '12 weeks',
    goal: 'Hypertrophy',
    bestFor: 'Intermediate lifters looking to build muscle',
    workoutDays: [
      {
        dayName: 'Chest Day',
        dayNumber: 1,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Main lift - control the negative' },
          { sets: 4, reps: '10-12', restSeconds: 75, notes: 'Upper chest focus' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Chest isolation' },
          { sets: 3, reps: '8-10', restSeconds: 90, notes: 'Tricep emphasis' },
          { sets: 3, reps: '15-20', restSeconds: 45, notes: 'Pump it up' },
        ],
        exerciseNames: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips', 'Cable Crossover'],
      },
      {
        dayName: 'Back Day',
        dayNumber: 2,
        exercises: [
          { sets: 4, reps: '6-8', restSeconds: 120, notes: 'Heavy compound' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Vertical pulling' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Horizontal pulling' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Upper back' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Back width' },
        ],
        exerciseNames: ['Deadlift', 'Pull-ups', 'Barbell Rows', 'Seal Chest Rows', 'Dumbbell Rows'],
      },
      {
        dayName: 'Shoulder Day',
        dayNumber: 3,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Main shoulder lift' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Medial delts' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Front delts' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Rear delts' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Trap emphasis' },
        ],
        exerciseNames: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Reverse Dumbbell Flyes', 'Shrugs'],
      },
      {
        dayName: 'Arm Day',
        dayNumber: 4,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Bicep main lift' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Bicep variation' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Tricep main lift' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Tricep isolation' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Bicep finisher' },
        ],
        exerciseNames: ['Barbell Curls', 'Dumbbell Curls', 'Tricep Pushdowns', 'Skull Crushers', 'Hammer Curls'],
      },
      {
        dayName: 'Leg Day',
        dayNumber: 5,
        exercises: [
          { sets: 4, reps: '6-8', restSeconds: 120, notes: 'Heavy main lift' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Machine alternative' },
          { sets: 4, reps: '6-8', restSeconds: 90, notes: 'Hamstring emphasis' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Hamstring isolation' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Calf burner' },
        ],
        exerciseNames: ['Barbell Squats', 'Leg Press', 'Romanian Deadlifts', 'Leg Curls', 'Calf Raises'],
      },
    ],
  },
  {
    name: 'Full Body Split',
    description: 'Train all body parts 2x per week - Great for beginners and recovery',
    daysPerWeek: 3,
    difficulty: 'Beginner',
    duration: '8 weeks',
    goal: 'Mixed',
    bestFor: 'Beginners and those with limited time',
    workoutDays: [
      {
        dayName: 'Full Body A',
        dayNumber: 1,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Upper body push' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Lower body quad focus' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Upper body pull' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Shoulder accessory' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Core work' },
        ],
        exerciseNames: ['Barbell Bench Press', 'Barbell Squats', 'Barbell Rows', 'Lateral Raises', 'Face Pulls'],
      },
      {
        dayName: 'Full Body B',
        dayNumber: 3,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Overhead pressing' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Lower body pull focus' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Chest accessory' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Back accessory' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Leg accessory' },
        ],
        exerciseNames: ['Overhead Press', 'Romanian Deadlifts', 'Smith Machine Bench Press', 'Cable Rows', 'Leg Extensions'],
      },
      {
        dayName: 'Full Body C',
        dayNumber: 5,
        exercises: [
          { sets: 4, reps: '6-8', restSeconds: 120, notes: 'Heavy deadlift variant' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Leg press variation' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Chest/tricep' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Back/bicep' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Isolation work' },
        ],
        exerciseNames: ['Deadlift', 'Machine Leg Press', 'Dips', 'Assisted Pull-ups', 'Calf Raises'],
      },
    ],
  },
  {
    name: 'Push/Pull/Legs (PPL)',
    description: 'Each muscle group trained once per week with high frequency - Excellent for growth',
    daysPerWeek: 6,
    difficulty: 'Intermediate',
    duration: '12 weeks',
    goal: 'Hypertrophy',
    bestFor: 'Intermediate+ lifters with good recovery',
    workoutDays: [
      {
        dayName: 'Push Day',
        dayNumber: 1,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Main push compound' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Secondary pressing' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Incline variation' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Lateral raising' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Overhead triceps' },
        ],
        exerciseNames: ['Barbell Bench Press', 'Overhead Press', 'Incline Barbell Press', 'Lateral Raises', 'Tricep Pushdowns'],
      },
      {
        dayName: 'Pull Day',
        dayNumber: 2,
        exercises: [
          { sets: 4, reps: '6-8', restSeconds: 120, notes: 'Heavy pulling compound' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Vertical pulling' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Horizontal pulling' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Face pulling' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Bicep work' },
        ],
        exerciseNames: ['Deadlift', 'Pull-ups', 'Machine Rows', 'Face Pulls', 'Barbell Curls'],
      },
      {
        dayName: 'Leg Day',
        dayNumber: 3,
        exercises: [
          { sets: 4, reps: '6-8', restSeconds: 120, notes: 'Heavy quad compound' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Secondary leg compound' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Hamstring focused' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Leg isolation' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Calf work' },
        ],
        exerciseNames: ['Barbell Squats', 'Leg Press', 'Romanian Deadlifts', 'Leg Curls', 'Calf Raises'],
      },
      {
        dayName: 'Push Day 2',
        dayNumber: 4,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Incline emphasis' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'OHP variation' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Dumbbell pressing' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Shoulder accessory' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Tricep accessory' },
        ],
        exerciseNames: ['Incline Dumbbell Press', 'Smith Machine Bench Press', 'Machine Chest Press', 'Reverse Dumbbell Flyes', 'Skull Crushers'],
      },
      {
        dayName: 'Pull Day 2',
        dayNumber: 5,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Row variation' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Pull-up variation' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Rowing accessory' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Reverse fly' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Bicep curl variation' },
        ],
        exerciseNames: ['Cable Rows', 'Assisted Pull-ups', 'Seal Chest Rows', 'Face Pulls', 'Dumbbell Curls'],
      },
      {
        dayName: 'Leg Day 2',
        dayNumber: 6,
        exercises: [
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Front squat variant' },
          { sets: 4, reps: '8-10', restSeconds: 90, notes: 'Deadlift variant' },
          { sets: 3, reps: '10-12', restSeconds: 75, notes: 'Leg press' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Quad isolation' },
          { sets: 3, reps: '12-15', restSeconds: 60, notes: 'Leg curl' },
        ],
        exerciseNames: ['Machine Leg Press', 'Romanian Deadlifts', 'Leg Extensions', 'Leg Curls', 'Calf Raises'],
      },
    ],
  },
]

async function seedPrograms() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected')

    // Clear existing exercises and programs
    await Exercise.deleteMany({})
    await Program.deleteMany({})
    console.log('✅ Cleared existing exercises and programs')

    // Create exercises
    const createdExercises = await Exercise.insertMany(exercisesData)
    const exerciseMap = {}
    createdExercises.forEach((ex) => {
      exerciseMap[ex.name] = ex._id
    })
    console.log(`✅ Created ${createdExercises.length} exercises`)

    // Update programs with exercise references
    const updatedPrograms = programsData.map((program) => {
      return {
        ...program,
        workoutDays: program.workoutDays.map((day) => {
          const exerciseNames = day.exerciseNames
          delete day.exerciseNames // Remove helper field
          return {
            ...day,
            exercises: day.exercises.map((exercise, index) => ({
              ...exercise,
              exerciseId: exerciseMap[exerciseNames[index]],
            })),
          }
        }),
      }
    })

    // Insert programs
    const createdPrograms = await Program.insertMany(updatedPrograms)
    console.log(`✅ Created ${createdPrograms.length} programs`)
    console.log(`   - Bro Split (5 days)`)
    console.log(`   - Full Body Split (3 days)`)
    console.log(`   - Push/Pull/Legs (6 days)`)

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error seeding programs:', error)
    process.exit(1)
  }
}

seedPrograms()
