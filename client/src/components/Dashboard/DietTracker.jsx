import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dietAPI } from '../../api/api'
import { BUDGET_HIGH_PROTEIN_MEALS } from '../../constants/budgetMeals'
import {
  AlertCircle,
  Loader,
  Plus,
  TrendingUp,
  Flame,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
} from 'lucide-react'

export default function DietTracker() {
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMealForm, setShowMealForm] = useState(false)
  const [expandedMeal, setExpandedMeal] = useState(null)
  const [mealData, setMealData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  })

  useEffect(() => {
    fetchDiet()
  }, [])

  const fetchDiet = async () => {
    try {
      setLoading(true)
      const response = await dietAPI.getCurrentDiet()
      setDiet(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load diet')
      console.error('Diet fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMeal = async (e) => {
    e.preventDefault()
    if (!mealData.name || !mealData.calories) {
      setError('Meal name and calories are required')
      return
    }

    try {
      const response = await dietAPI.trackMeal({
        name: mealData.name,
        calories: parseInt(mealData.calories),
        protein: mealData.protein ? parseInt(mealData.protein) : 0,
        carbs: mealData.carbs ? parseInt(mealData.carbs) : 0,
        fats: mealData.fats ? parseInt(mealData.fats) : 0,
      })
      setDiet(response.data)
      setMealData({ name: '', calories: '', protein: '', carbs: '', fats: '' })
      setShowMealForm(false)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add meal')
    }
  }

  const handleQuickMealAdd = async (meal) => {
    try {
      const response = await dietAPI.trackMeal({
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
      })
      setDiet(response.data)
      setError('')
      setExpandedMeal(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add meal')
    }
  }

  const getMacroProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getColorClass = (color) => {
    const colorMap = {
      'text-red-400': 'bg-red-400',
      'text-blue-400': 'bg-blue-400',
      'text-yellow-400': 'bg-yellow-400',
    }
    return colorMap[color] || 'bg-[#CCFF00]'
  }

  const renderProgressBar = (current, target, color, label) => {
    // For protein, handle range
    const displayTarget = typeof target === 'object' ? target.target : target
    const percentage = getMacroProgress(current, displayTarget)
    const bgColor = getColorClass(color)
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{label}</span>
          <span className={`font-semibold ${color}`}>
            {current} / {displayTarget}g
          </span>
        </div>
        <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full rounded-full ${bgColor}`}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 text-[#CCFF00] animate-spin" />
      </div>
    )
  }

  if (!diet) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-400">Set up your nutrition plan to track meals</p>
      </div>
    )
  }

  const totals = diet.totalsToday || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-[#CCFF00]" />
        <h2 className="text-2xl font-bold text-white">Daily Nutrition Tracker</h2>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Calorie Summary */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Calories</p>
              <p className="text-3xl font-bold text-[#CCFF00]">
                {totals.calories} / {diet.dailyCalories}
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#00D9FF]">
            {Math.round((totals.calories / diet.dailyCalories) * 100)}%
          </p>
        </div>
        <div className="w-full bg-[#2a2a2a] rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totals.calories / diet.dailyCalories) * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-[#CCFF00]"
          />
        </div>
      </div>

      {/* Macros */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-6">
        <h3 className="text-white font-semibold">Macro Breakdown</h3>

        {renderProgressBar(
          totals.protein,
          diet.macroTargets.protein,
          'text-red-400',
          'Protein'
        )}
        {renderProgressBar(
          totals.carbs,
          diet.macroTargets.carbs,
          'text-blue-400',
          'Carbs'
        )}
        {renderProgressBar(
          totals.fats,
          diet.macroTargets.fats,
          'text-yellow-400',
          'Fats'
        )}
      </div>

      {/* Meals Today */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Meals Today</h3>
        {diet.mealsToday && diet.mealsToday.length > 0 ? (
          <div className="space-y-3">
            {diet.mealsToday.map((meal, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold">{meal.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(meal.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-[#CCFF00] font-bold">{meal.calories} cal</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No meals logged yet</p>
        )}
      </div>

      {/* Quick Meal Suggestions */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#CCFF00]" />
          <h3 className="text-white font-semibold">Quick Budget Meals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BUDGET_HIGH_PROTEIN_MEALS.map((meal, idx) => (
            <motion.button
              key={idx}
              onClick={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
              whileHover={{ scale: 1.05 }}
              className="p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-[#CCFF00] transition text-left"
            >
              <p className="text-2xl mb-1">{meal.icon}</p>
              <p className="text-sm text-white font-semibold">{meal.name}</p>
              <p className="text-xs text-gray-400">{meal.calories}cal • P:{meal.protein}g</p>
              <p className="text-xs text-[#CCFF00] mt-2">
                {expandedMeal === meal.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Expandable Meal Details */}
        {expandedMeal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-[#2a2a2a]"
          >
            {BUDGET_HIGH_PROTEIN_MEALS.filter((m) => m.id === expandedMeal).map(
              (meal) => (
                <div key={meal.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <p className="text-4xl">{meal.icon}</p>
                    <div>
                      <h4 className="text-xl font-bold text-white">{meal.name}</h4>
                      <p className="text-gray-400">{meal.description}</p>
                    </div>
                  </div>

                  {/* Nutrition Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a]">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Calories</p>
                      <p className="text-lg font-bold text-[#CCFF00]">{meal.calories}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Protein</p>
                      <p className="text-lg font-bold text-red-400">{meal.protein}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Carbs</p>
                      <p className="text-lg font-bold text-blue-400">{meal.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Fats</p>
                      <p className="text-lg font-bold text-yellow-400">{meal.fats}g</p>
                    </div>
                  </div>

                  {/* Serving Size & Prep Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a]">
                      <p className="text-xs text-gray-500 uppercase mb-2">Serving Size</p>
                      <p className="text-white font-semibold">{meal.servingSize}</p>
                    </div>
                    <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a]">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#CCFF00]" />
                        <p className="text-xs text-gray-500 uppercase">Prep Time</p>
                      </div>
                      <p className="text-white font-semibold">{meal.prepTime}</p>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#2a2a2a]">
                    <p className="text-white font-semibold mb-3">Ingredients</p>
                    <ul className="space-y-2">
                      {meal.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#CCFF00] rounded-full"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Add Meal Button */}
                  <motion.button
                    onClick={() => handleQuickMealAdd(meal)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-[#CCFF00] to-[#00D9FF] text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#CCFF00]/50 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add {meal.name} to Today
                  </motion.button>
                </div>
              )
            )}
          </motion.div>
        )}
      </div>

      {/* Add Meal Form */}
      {!showMealForm ? (
        <motion.button
          onClick={() => setShowMealForm(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-[#CCFF00] to-[#00D9FF] text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#CCFF00]/50 transition"
        >
          <Plus className="w-5 h-5" />
          Log Custom Meal
        </motion.button>
      ) : (
        <motion.form
          onSubmit={handleAddMeal}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4"
        >
          <h3 className="text-white font-semibold mb-4">Add New Meal</h3>

          <input
            type="text"
            placeholder="Meal name (e.g., Chicken & Rice)"
            value={mealData.name}
            onChange={(e) => setMealData({ ...mealData, name: e.target.value })}
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#CCFF00]"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Calories *"
              value={mealData.calories}
              onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#CCFF00]"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={mealData.protein}
              onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Carbs (g)"
              value={mealData.carbs}
              onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#CCFF00]"
            />
            <input
              type="number"
              placeholder="Fats (g)"
              value={mealData.fats}
              onChange={(e) => setMealData({ ...mealData, fats: e.target.value })}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#CCFF00]"
            />
          </div>

          <div className="flex gap-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              className="flex-1 py-2 bg-gradient-to-r from-[#CCFF00] to-[#00D9FF] text-black font-bold rounded-lg"
            >
              Save Meal
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowMealForm(false)}
              whileHover={{ scale: 1.02 }}
              className="flex-1 py-2 bg-[#2a2a2a] text-white font-bold rounded-lg"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  )
}
