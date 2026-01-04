import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Exercise from '../models/Exercise.js'
import Program from '../models/Program.js'

dotenv.config()

// Sample exercises
const sampleExercises = [
  // Chest
  {
    name: 'Barbell Bench Press',
    category: 'Chest',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Bench'],
    description: 'The classic chest builder. Lie flat and push the barbell away from your chest.',
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    equipment: ['Dumbbells', 'Bench'],
    description: 'Targets upper chest. Perform on an inclined bench.',
  },
  {
    name: 'Cable Flyes',
    category: 'Chest',
    muscleGroup: 'Chest',
    difficulty: 'Beginner',
    equipment: ['Cable Machine'],
    description: 'Isolated chest movement. Great for chest peak contraction.',
  },

  // Back
  {
    name: 'Barbell Deadlift',
    category: 'Back',
    muscleGroup: 'Back',
    difficulty: 'Advanced',
    equipment: ['Barbell'],
    description: 'The king of compound exercises. Build massive back thickness.',
  },
  {
    name: 'Barbell Rows',
    category: 'Back',
    muscleGroup: 'Back',
    difficulty: 'Intermediate',
    equipment: ['Barbell'],
    description: 'Bent over rowing for back strength and size.',
  },
  {
    name: 'Lat Pulldowns',
    category: 'Back',
    muscleGroup: 'Back',
    difficulty: 'Beginner',
    equipment: ['Cable Machine'],
    description: 'Build lat width. Great for beginners.',
  },

  // Shoulders
  {
    name: 'Overhead Press',
    category: 'Shoulders',
    muscleGroup: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Dumbbells'],
    description: 'Standing or seated shoulder press for strength.',
  },
  {
    name: 'Lateral Raises',
    category: 'Shoulders',
    muscleGroup: 'Shoulders',
    difficulty: 'Beginner',
    equipment: ['Dumbbells'],
    description: 'Build shoulder width and definition.',
  },
  {
    name: 'Reverse Pec Deck',
    category: 'Shoulders',
    muscleGroup: 'Shoulders',
    difficulty: 'Beginner',
    equipment: ['Machine'],
    description: 'Isolate rear delts for shoulder balance.',
  },

  // Legs
  {
    name: 'Barbell Squats',
    category: 'Legs',
    muscleGroup: 'Quadriceps',
    difficulty: 'Advanced',
    equipment: ['Barbell', 'Rack'],
    description: 'The king of leg exercises. Build massive quads.',
  },
  {
    name: 'Romanian Deadlifts',
    category: 'Legs',
    muscleGroup: 'Hamstrings',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Dumbbells'],
    description: 'Target hamstrings and lower back.',
  },
  {
    name: 'Leg Press',
    category: 'Legs',
    muscleGroup: 'Quadriceps',
    difficulty: 'Beginner',
    equipment: ['Machine'],
    description: 'Machine-based leg movement. Great for volume.',
  },
  {
    name: 'Leg Curls',
    category: 'Legs',
    muscleGroup: 'Hamstrings',
    difficulty: 'Beginner',
    equipment: ['Machine'],
    description: 'Isolate hamstrings.',
  },
  {
    name: 'Walking Lunges',
    category: 'Legs',
    muscleGroup: 'Quadriceps',
    difficulty: 'Intermediate',
    equipment: [],
    description: 'Dynamic movement for quads and glutes.',
  },

  // Arms
  {
    name: 'Barbell Curls',
    category: 'Arms',
    muscleGroup: 'Biceps',
    difficulty: 'Beginner',
    equipment: ['Barbell'],
    description: 'Classic bicep builder.',
  },
  {
    name: 'Skull Crushers',
    category: 'Arms',
    muscleGroup: 'Triceps',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'EZ-Bar'],
    description: 'Tricep mass builder.',
  },
  {
    name: 'Rope Pushdowns',
    category: 'Arms',
    muscleGroup: 'Triceps',
    difficulty: 'Beginner',
    equipment: ['Cable Machine'],
    description: 'Isolate triceps.',
  },
  {
    name: 'Hammer Curls',
    category: 'Arms',
    muscleGroup: 'Biceps',
    difficulty: 'Beginner',
    equipment: ['Dumbbells'],
    description: 'Build bicep thickness.',
  },

  // Abs
  {
    name: 'Barbell Bench Crunches',
    category: 'Abs',
    muscleGroup: 'Abs',
    difficulty: 'Intermediate',
    equipment: ['Cable Machine'],
    description: 'Heavy ab work.',
  },
  {
    name: 'Weighted Dips',
    category: 'Abs',
    muscleGroup: 'Abs',
    difficulty: 'Advanced',
    equipment: ['Dip Station', 'Weights'],
    description: 'Challenging core exercise.',
  },
]

// Sample programs
const getProgramData = async () => {
  const exercises = await Exercise.find()
  const exerciseMap = new Map(exercises.map((e) => [e.name, e._id]))

  return [
    {
      name: 'Bro Split',
      description: 'Classic bodybuilding split. One muscle group per day.',
      daysPerWeek: 5,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      goal: 'Hypertrophy',
      bestFor: 'Bodybuilders looking for maximum volume per muscle group',
      workoutDays: [
        {
          dayName: 'Chest',
          dayNumber: 1,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Bench Press'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Incline Dumbbell Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Cable Flyes'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Back',
          dayNumber: 2,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Deadlift'),
              sets: 3,
              reps: '5-6',
              restSeconds: 180,
            },
            {
              exerciseId: exerciseMap.get('Barbell Rows'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Lat Pulldowns'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
          ],
        },
        {
          dayName: 'Shoulders',
          dayNumber: 3,
          exercises: [
            {
              exerciseId: exerciseMap.get('Overhead Press'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Lateral Raises'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
            {
              exerciseId: exerciseMap.get('Reverse Pec Deck'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Legs',
          dayNumber: 4,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Squats'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Romanian Deadlifts'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Leg Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Leg Curls'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Arms',
          dayNumber: 5,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Curls'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Skull Crushers'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Hammer Curls'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
            {
              exerciseId: exerciseMap.get('Rope Pushdowns'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
      ],
    },
    {
      name: 'Push/Pull/Legs',
      description: 'Train push (chest, shoulders, triceps), pull (back, biceps), and legs separately.',
      daysPerWeek: 6,
      difficulty: 'Intermediate',
      duration: '12 weeks',
      goal: 'Hypertrophy',
      bestFor: 'Athletes who can train 6 days per week with good recovery',
      workoutDays: [
        {
          dayName: 'Push',
          dayNumber: 1,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Bench Press'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Incline Dumbbell Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Overhead Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Lateral Raises'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
            {
              exerciseId: exerciseMap.get('Rope Pushdowns'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Pull',
          dayNumber: 2,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Deadlift'),
              sets: 3,
              reps: '5-6',
              restSeconds: 180,
            },
            {
              exerciseId: exerciseMap.get('Barbell Rows'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Lat Pulldowns'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Barbell Curls'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Hammer Curls'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Legs',
          dayNumber: 3,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Squats'),
              sets: 4,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Romanian Deadlifts'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Leg Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Walking Lunges'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
            {
              exerciseId: exerciseMap.get('Leg Curls'),
              sets: 3,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
      ],
    },
    {
      name: 'Full Body',
      description: 'Train all muscle groups in each session. Great for beginners and recovery.',
      daysPerWeek: 3,
      difficulty: 'Beginner',
      duration: '12 weeks',
      goal: 'Mixed',
      bestFor: 'Beginners or those with limited training time',
      workoutDays: [
        {
          dayName: 'Full Body A',
          dayNumber: 1,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Squats'),
              sets: 3,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Barbell Bench Press'),
              sets: 3,
              reps: '6-8',
              restSeconds: 120,
            },
            {
              exerciseId: exerciseMap.get('Lat Pulldowns'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Lateral Raises'),
              sets: 2,
              reps: '10-12',
              restSeconds: 60,
            },
          ],
        },
        {
          dayName: 'Full Body B',
          dayNumber: 3,
          exercises: [
            {
              exerciseId: exerciseMap.get('Barbell Deadlift'),
              sets: 3,
              reps: '5-6',
              restSeconds: 180,
            },
            {
              exerciseId: exerciseMap.get('Incline Dumbbell Press'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Barbell Rows'),
              sets: 3,
              reps: '8-10',
              restSeconds: 90,
            },
            {
              exerciseId: exerciseMap.get('Barbell Curls'),
              sets: 2,
              reps: '8-10',
              restSeconds: 90,
            },
          ],
        },
      ],
    },
  ]
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Exercise.deleteMany({})
    await Program.deleteMany({})

    // Seed exercises
    const createdExercises = await Exercise.insertMany(sampleExercises)
    console.log(`✅ Seeded ${createdExercises.length} exercises`)

    // Seed programs
    const programData = await getProgramData()
    const createdPrograms = await Program.insertMany(programData)
    console.log(`✅ Seeded ${createdPrograms.length} programs`)

    console.log('✅ Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
