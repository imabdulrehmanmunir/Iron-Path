import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { programAPI } from '../api/api'
import { ChevronDown, ChevronUp, Dumbbell, RotateCw, Clock, AlertCircle, Loader } from 'lucide-react'

export default function ProgramDetails() {
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedDays, setExpandedDays] = useState({})

  useEffect(() => {
    fetchCurrentProgram()
  }, [])

  const fetchCurrentProgram = async () => {
    try {
      const response = await programAPI.getCurrentProgram()
      const programId = response.data.userWorkout.programId._id
      const programResponse = await programAPI.getProgramById(programId)
      setProgram(programResponse.data.program)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load program')
      setTimeout(() => navigate('/dashboard'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }))
  }

  const handleStartWorkout = async () => {
    try {
      // Get the first workout day from the program
      const firstDay = program.workoutDays[0]
      if (!firstDay) {
        setError('No workout days found')
        return
      }

      // Prepare exercises data with default sets/reps
      const exercises = firstDay.exercises.map((exercise) => ({
        exerciseName: exercise.exerciseId.name,
        setsCompleted: exercise.sets,
        repsPerSet: Array(exercise.sets).fill(exercise.reps), // Stores rep ranges like "8-10", "10-12"
        weight: Array(exercise.sets).fill(0), // User can fill in actual weights
      }))

      // Log current workout as completed
      await programAPI.completeWorkout({
        workoutData: {
          dayName: firstDay.dayName,
          exercises: exercises,
        },
      })

      // Show success and redirect
      alert('✅ Workout logged! Great effort!')
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to log workout: ' + (err.response?.data?.message || err.message))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-neon-green animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading program details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-neon-green text-black font-semibold px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-neon-green text-black font-semibold px-6 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-neon-green hover:underline text-sm font-semibold mb-4 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-oswald font-bold text-white mb-4">
            {program.name}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{program.description}</p>

          {/* Program Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Days Per Week</p>
              <p className="text-2xl font-oswald font-bold text-neon-green">
                {program.daysPerWeek}
              </p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Duration</p>
              <p className="text-2xl font-oswald font-bold text-electric-blue">
                {program.duration}
              </p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Difficulty</p>
              <p className="text-lg font-oswald font-bold text-orange-500">
                {program.difficulty}
              </p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Goal</p>
              <p className="text-lg font-oswald font-bold text-purple-500">{program.goal}</p>
            </div>
          </div>
        </motion.div>

        {/* Workout Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-oswald font-bold text-white mb-6">Workout Schedule</h2>

          {program.workoutDays.map((day, dayIndex) => (
            <div key={dayIndex} className="glass rounded-xl overflow-hidden">
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayIndex)}
                className="w-full flex items-center justify-between p-6 hover:bg-dark-bg/50 transition"
              >
                <div className="flex items-center gap-4 flex-grow text-left">
                  <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-neon-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-oswald font-bold text-white">{day.dayName}</h3>
                    <p className="text-gray-400 text-sm">
                      {day.exercises.length} exercises
                    </p>
                  </div>
                </div>
                <div>
                  {expandedDays[dayIndex] ? (
                    <ChevronUp className="w-6 h-6 text-neon-green" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Day Exercises */}
              {expandedDays[dayIndex] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-dark-border px-6 py-6 space-y-4"
                >
                  {day.exercises.map((exercise, exIndex) => {
                    const exerciseData = exercise.exerciseId
                    return (
                      <motion.div
                        key={exIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: exIndex * 0.05 }}
                        className="bg-dark-bg/50 rounded-lg p-4 border border-dark-border hover:border-neon-green/50 transition"
                      >
                        {/* Exercise Title */}
                        <h4 className="font-semibold text-white mb-3">
                          {exIndex + 1}. {exerciseData.name}
                        </h4>

                        {/* Exercise Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {/* Sets */}
                          <div className="flex items-center gap-2">
                            <RotateCw className="w-4 h-4 text-electric-blue" />
                            <div>
                              <p className="text-xs text-gray-400">Sets</p>
                              <p className="font-semibold text-white">{exercise.sets}</p>
                            </div>
                          </div>

                          {/* Reps */}
                          <div className="flex items-center gap-2">
                            <Dumbbell className="w-4 h-4 text-neon-green" />
                            <div>
                              <p className="text-xs text-gray-400">Reps</p>
                              <p className="font-semibold text-white">{exercise.reps}</p>
                            </div>
                          </div>

                          {/* Rest */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="text-xs text-gray-400">Rest</p>
                              <p className="font-semibold text-white">
                                {exercise.restSeconds}s
                              </p>
                            </div>
                          </div>

                          {/* Difficulty */}
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  exerciseData.difficulty === 'Beginner'
                                    ? '#10b981'
                                    : exerciseData.difficulty === 'Intermediate'
                                      ? '#f59e0b'
                                      : '#ef4444',
                              }}
                            ></div>
                            <div>
                              <p className="text-xs text-gray-400">Level</p>
                              <p className="font-semibold text-white text-sm">
                                {exerciseData.difficulty}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Exercise Description */}
                        {exerciseData.description && (
                          <p className="text-sm text-gray-400 mb-3">{exerciseData.description}</p>
                        )}

                        {/* Equipment */}
                        {exerciseData.equipment && exerciseData.equipment.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exerciseData.equipment.map((eq, i) => (
                              <span
                                key={i}
                                className="text-xs bg-neon-green/10 text-neon-green px-2 py-1 rounded"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}

                  {/* Notes for the day */}
                  {day.notes && (
                    <div className="bg-electric-blue/10 border border-electric-blue/50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-electric-blue">{day.notes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass p-8 rounded-xl mt-12"
        >
          <h3 className="text-2xl font-oswald font-bold text-white mb-4">Program Tips</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex gap-3">
              <span className="text-neon-green">→</span>
              <span>
                Focus on proper form over weight. It's better to do the exercise correctly with
                lighter weight than to lift heavier with bad form.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">→</span>
              <span>
                Rest between sets is crucial for muscle recovery. Stick to the recommended rest
                times.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">→</span>
              <span>
                Progressive overload is key. Try to increase weight or reps each week to continue
                making gains.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-neon-green">→</span>
              <span>
                Track your workouts. Logging your sets and reps helps you stay accountable and
                measure progress.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex gap-4 mt-8 mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-dark-card border border-dark-border text-white font-semibold py-3 rounded-lg hover:border-neon-green/50 transition"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handleStartWorkout}
            className="flex-1 bg-neon-green text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
          >
            Start Workout
          </button>
        </motion.div>
      </div>
    </div>
  )
}
