import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dietAPI } from '../../api/api'
import { AlertCircle, Loader, Utensils, ShoppingCart, Pill } from 'lucide-react'

export default function DietSelector() {
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('maintain')
  // single normal diet — no types

  const goals = [
    { id: 'bulk', label: 'Bulk (Gain)', color: 'from-orange-500 to-red-500' },
    { id: 'maintain', label: 'Maintain', color: 'from-green-500 to-emerald-500' },
    { id: 'cut', label: 'Cut (Lose)', color: 'from-blue-500 to-cyan-500' },
  ]

  // diet types removed

  useEffect(() => {
    fetchDiet()
  }, [])

  const fetchDiet = async () => {
    try {
      setLoading(true)
      const response = await dietAPI.getCurrentDiet()
      setDiet(response.data)
      setSelectedGoal(response.data.goal)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load diet')
      console.error('Diet fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDiet = async () => {
    try {
      setLoading(true)
      const response = await dietAPI.createDiet({
        goal: selectedGoal,
      })
      setDiet(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create diet')
    } finally {
      setLoading(false)
    }
  }

  const handleResetDiet = () => {
    setDiet(null)
    setSelectedGoal('maintain')
    // single normal diet — nothing else to reset
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 text-[#CCFF00] animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Utensils className="w-6 h-6 text-[#CCFF00]" />
        <h2 className="text-2xl font-bold text-white">Nutrition Plan</h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {!diet ? (
        <div className="space-y-6">
          {/* Goal Selection */}
          <div>
            <h3 className="text-white font-semibold mb-3">Your Fitness Goal</h3>
            <div className="grid grid-cols-3 gap-3">
              {goals.map((goal) => (
                <motion.button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedGoal === goal.id
                      ? `border-[#CCFF00] bg-gradient-to-br ${goal.color}`
                      : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#CCFF00]/50'
                  }`}
                >
                  <p className="font-semibold text-white">{goal.label}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Single normal diet will be created — no type selection needed */}

          {/* Create Button */}
          <motion.button
            onClick={handleCreateDiet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-[#CCFF00] to-[#00D9FF] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#CCFF00]/50 transition"
          >
            Create Nutrition Plan
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diet Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Daily Calorie Target</p>
              <p className="text-3xl font-bold text-[#CCFF00]">
                {diet.dailyCalories.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">calories/day</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Current Goal</p>
              <p className="text-2xl font-bold text-[#00D9FF] capitalize">
                {diet.goal}
              </p>
            </div>
          </div>

          {/* Macro Targets */}
          <div>
            <h3 className="text-white font-semibold mb-3">Daily Macro Targets</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Protein</p>
                <p className="text-2xl font-bold text-red-400">
                  {diet.macroTargets.protein?.min || diet.macroTargets.protein}-{diet.macroTargets.protein?.max || diet.macroTargets.protein}g
                </p>
                <p className="text-xs text-gray-500 mt-1">range • target {diet.macroTargets.protein?.target}g</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Carbs</p>
                <p className="text-2xl font-bold text-blue-400">
                  {diet.macroTargets.carbs}
                </p>
                <p className="text-xs text-gray-500 mt-1">grams</p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
                <p className="text-gray-400 text-sm">Fats</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {diet.macroTargets.fats}
                </p>
                <p className="text-xs text-gray-500 mt-1">grams</p>
              </div>
            </div>
          </div>

          {/* Single normal diet — no diet type options */}
          <motion.button
            onClick={handleResetDiet}
            whileHover={{ scale: 1.02 }}
            className="w-full py-2 mt-4 bg-[#2a2a2a] text-white font-semibold rounded-lg hover:bg-[#3a3a3a] transition"
          >
            Change Plan
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
