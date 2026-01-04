import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { programAPI } from '../../api/api'
import { Zap, Users, Clock, Target, AlertCircle, Loader } from 'lucide-react'

export default function ProgramSelector() {
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await programAPI.getAllPrograms()
      setPrograms(response.data.programs)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProgram = async (programId) => {
    setSubmitting(true)
    try {
      const response = await programAPI.selectProgram(programId)
      setSelectedProgram(programId)
      setError('')
      // Wait for server to have the current program available before navigating
      // Poll for current program (small retry loop) to avoid 404 on dashboard load
      const maxAttempts = 5
      let attempt = 0
      let gotProgram = false
      while (attempt < maxAttempts && !gotProgram) {
        try {
          await new Promise((r) => setTimeout(r, 200))
          const cur = await programAPI.getCurrentProgram()
          if (cur?.data?.userWorkout) {
            gotProgram = true
            break
          }
        } catch (e) {
          navigate('/dashboard')
        }
        attempt++
      }

      // Navigate to dashboard after polling (even if not found after retries)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to select program')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-neon-green animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading workout programs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-oswald font-bold text-white mb-4">
            Choose Your Workout Program
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select a scientifically-designed program based on your goals and available training days
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8 max-w-2xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Programs Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="flex flex-col h-full"
            >
              <div className="glass p-8 rounded-xl flex flex-col h-full hover:border-neon-green/50 transition">
                {/* Program Title */}
                <h2 className="text-2xl font-oswald font-bold text-white mb-2">
                  {program.name}
                </h2>

                {/* Program Description */}
                <p className="text-gray-400 text-sm mb-6 flex-grow">
                  {program.description}
                </p>

                {/* Best For */}
                {program.bestFor && (
                  <p className="text-neon-green text-xs font-semibold mb-4 bg-neon-green/10 px-3 py-1 rounded-lg inline-block">
                    {program.bestFor}
                  </p>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Days Per Week */}
                  <div className="bg-dark-bg/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-electric-blue" />
                      <p className="text-xs text-gray-400">Days/Week</p>
                    </div>
                    <p className="text-xl font-oswald font-bold text-white">
                      {program.daysPerWeek}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="bg-dark-bg/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-neon-green" />
                      <p className="text-xs text-gray-400">Duration</p>
                    </div>
                    <p className="text-xl font-oswald font-bold text-white">
                      {program.duration}
                    </p>
                  </div>

                  {/* Difficulty */}
                  <div className="bg-dark-bg/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-orange-500" />
                      <p className="text-xs text-gray-400">Level</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {program.difficulty}
                    </p>
                  </div>

                  {/* Goal */}
                  <div className="bg-dark-bg/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-purple-500" />
                      <p className="text-xs text-gray-400">Goal</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {program.goal}
                    </p>
                  </div>
                </div>

                {/* Select Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectProgram(program._id)}
                  disabled={submitting && selectedProgram === program._id}
                  className={`w-full font-semibold py-2.5 rounded-lg transition ${
                    submitting && selectedProgram === program._id
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-neon-green text-black hover:bg-opacity-90'
                  }`}
                >
                  {submitting && selectedProgram === program._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Starting...
                    </span>
                  ) : (
                    'Start Program'
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {programs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No programs available</p>
          </div>
        )}
      </div>
    </div>
  )
}
