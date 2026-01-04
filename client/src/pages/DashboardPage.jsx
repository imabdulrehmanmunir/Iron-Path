import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { programAPI, profileAPI } from '../api/api'
import OnboardingWizard from '../components/Onboarding/OnboardingWizard'
import ProgramSelector from '../components/Dashboard/ProgramSelector'
import ProgressDashboard from '../components/Dashboard/ProgressDashboard'
import DietSelector from '../components/Dashboard/DietSelector'
import DietTracker from '../components/Dashboard/DietTracker'
import { LogOut, Flame, ChevronRight, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const [currentProgram, setCurrentProgram] = useState(null)
  const [programLoading, setProgramLoading] = useState(true)
  const [programSummary, setProgramSummary] = useState(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  const [showGoalChange, setShowGoalChange] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      fetchCurrentProgram()
    }
  }, [user, refetchTrigger])

  // Refetch program when page comes into focus (navigation back to dashboard)
  useEffect(() => {
    const handleFocus = () => {
      if (user && user.onboardingCompleted) {
        fetchCurrentProgram()
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  const fetchCurrentProgram = async () => {
    try {
      // Add small delay to ensure server has processed recent changes
      await new Promise(resolve => setTimeout(resolve, 200))
      const response = await programAPI.getCurrentProgram()
      setCurrentProgram(response.data.userWorkout)
      setProgramSummary(null)
    } catch (err) {
      // No active program
      setCurrentProgram(null)
      setProgramSummary(null)
    } finally {
      setProgramLoading(false)
    }
  }

  const handleCancelProgram = async () => {
    if (!confirm('Are you sure you want to cancel your current program?')) return

    try {
      setProgramLoading(true)
      const response = await programAPI.cancelProgram()
      setProgramSummary(response.data.summary)
      setCurrentProgram(null)
      // trigger a refetch so other components know the program was cancelled
      setRefetchTrigger((t) => t + 1)
    } catch (err) {
      console.error('Cancel program error:', err)
    } finally {
      setProgramLoading(false)
    }
  }

  const handleStartNewProgram = () => {
    if (!showGoalChange) {
      setShowGoalChange(true)
    } else {
      setProgramSummary(null)
      setCurrentProgram(null)
      setShowGoalChange(false)
    }
  }

  const handleGoalChange = async (newGoal) => {
    try {
      setProgramLoading(true)
      // Update user goal
      await profileAPI.updateProfile({ goal: newGoal })
      setSelectedGoal(newGoal)
      setShowGoalChange(false)
      setProgramSummary(null)
      setCurrentProgram(null)
      // Re-fetch to update user context
      window.location.reload()
    } catch (err) {
      console.error('Goal change error:', err)
    } finally {
      setProgramLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dark-border border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show onboarding if user hasn't completed it
  if (user && !user.onboardingCompleted) {
    return <OnboardingWizard />
  }

  // Show program selector if no program selected
  if (user && programLoading === false && !currentProgram) {
    return <ProgramSelector />
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="border-b border-dark-border bg-dark-card/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-neon-green" />
            <span className="font-oswald font-bold text-white text-xl">IronPath</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-400 hover:text-neon-green transition px-4 py-2 rounded-lg hover:bg-dark-bg/50"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-oswald font-bold text-white mb-2">
            Welcome back, {user?.name}! 💪
          </h1>
          <p className="text-gray-400">Keep crushing your goals</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* BMR Card */}
          <div className="glass p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Basal Metabolic Rate</p>
            <p className="text-3xl font-oswald font-bold text-neon-green">{user?.bmr}</p>
            <p className="text-gray-500 text-xs mt-2">Calories at rest</p>
          </div>

          {/* TDEE Card */}
          <div className="glass p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Daily Energy Expenditure</p>
            <p className="text-3xl font-oswald font-bold text-electric-blue">{user?.tdee}</p>
            <p className="text-gray-500 text-xs mt-2">Calories to maintain</p>
          </div>

          {/* Goal Card */}
          <div className="glass p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">Current Goal</p>
            <p className="text-3xl font-oswald font-bold text-white capitalize">
              {user?.goal}
            </p>
            <p className="text-gray-500 text-xs mt-2">Personalized for you</p>
          </div>
        </div>

        {/* Program Summary Section */}
        {programSummary && (
          <div className="mb-12">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="glass p-8 rounded-xl border border-blue-500/20">
              <h2 className="text-2xl font-oswald font-bold text-white mb-6">
                Program Summary 📊
              </h2>

              {/* Program Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Program</p>
                  <p className="text-white font-bold mt-2">{programSummary.programName}</p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Workouts Completed</p>
                  <p className="text-neon-green font-bold text-2xl mt-2">
                    {programSummary.workoutsCompleted}
                  </p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Weeks Completed</p>
                  <p className="text-electric-blue font-bold text-2xl mt-2">
                    {programSummary.weeksCompleted}
                  </p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Sets</p>
                  <p className="text-orange-400 font-bold text-2xl mt-2">
                    {programSummary.totalVolume}
                  </p>
                </motion.div>
              </div>

              {/* Date Range */}
              <div className="mb-8 p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                <p className="text-gray-400 text-sm mb-2">Duration</p>
                <p className="text-white font-semibold">
                  {new Date(programSummary.startDate).toLocaleDateString()} →{' '}
                  {new Date(programSummary.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Goal Change Section */}
              {showGoalChange && (
                <div className="mb-8 p-6 bg-purple-500/10 border border-purple-500/50 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Change Your Goal</h3>
                  <p className="text-gray-400 mb-4">
                    Your current goal is <span className="font-semibold capitalize text-white">{user?.goal}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['bulk', 'maintain', 'cut'].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => handleGoalChange(goal)}
                        disabled={programLoading}
                        className={`p-4 rounded-lg font-semibold transition ${
                          goal === 'bulk'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : goal === 'maintain'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        } ${user?.goal === goal ? 'ring-2 ring-yellow-400' : ''} disabled:opacity-50`}
                      >
                        <div className="text-2xl mb-1">
                          {goal === 'bulk' ? '📈' : goal === 'maintain' ? '⚖️' : '📉'}
                        </div>
                        <div className="capitalize font-oswald text-lg">{goal}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {goal === 'bulk'
                            ? 'Gain muscle'
                            : goal === 'maintain'
                            ? 'Stay same'
                            : 'Lose fat'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartNewProgram} className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:bg-opacity-90 transition">
                {showGoalChange ? 'Keep Current Goal' : 'Select New Program'}
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Current Program Section */}
        {currentProgram && (
          <div className="mb-12">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="glass p-8 rounded-xl border border-neon-green/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-oswald font-bold text-white mb-2">
                    {currentProgram.programId?.name}
                  </h2>
                  <p className="text-gray-400">
                    Week {currentProgram.currentWeek} • Started{' '}
                    {new Date(currentProgram.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/program-details')} className="flex items-center justify-center gap-2 bg-neon-green text-black font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 transition w-full sm:w-auto">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCancelProgram} disabled={programLoading} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 w-full sm:w-auto">
                    <Trash2 className="w-4 h-4" />
                    Cancel Program
                  </motion.button>
                </div>
              </div>

              {/* Program Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Days/Week</p>
                  <p className="text-xl font-bold text-neon-green">
                    {currentProgram.programId?.daysPerWeek}
                  </p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-xl font-bold text-electric-blue">
                    {currentProgram.programId?.duration}
                  </p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Total Days</p>
                  <p className="text-xl font-bold text-orange-500">
                    {currentProgram.programId?.workoutDays?.length || 0}
                  </p>
                </motion.div>
                <motion.div whileHover={{ y: -4 }} className="bg-dark-bg/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Workouts Done</p>
                  <p className="text-xl font-bold text-purple-500">
                    {currentProgram.completedWorkouts?.length || 0}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Progress Dashboard */}
        {currentProgram && (
          <div className="mb-12">
            <h2 className="text-2xl font-oswald font-bold text-white mb-6">Your Progress</h2>
            <ProgressDashboard userWorkout={currentProgram} />
          </div>
        )}

        {/* Nutrition Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <DietSelector />
          <DietTracker />
        </div>

        {/* Quick Actions */}
        <div className="glass p-8 rounded-xl text-center">
          <p className="text-gray-400 mb-4">Ready to crush today's workout?</p>
          <button 
            onClick={() => navigate('/program-details')}
            className="bg-neon-green text-black font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
          >
            Start Today's Workout
          </button>
        </div>
      </div>
    </div>
  )
}
