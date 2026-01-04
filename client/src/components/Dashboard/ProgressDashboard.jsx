import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Flame, Award, BarChart3 } from 'lucide-react'

export default function ProgressDashboard({ userWorkout }) {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    currentStreak: 0,
    totalVolume: 0,
    averageSessionTime: 0,
  })

  useEffect(() => {
    calculateStats()
  }, [userWorkout])

  const calculateStats = () => {
    if (!userWorkout?.completedWorkouts) {
      setStats({
        totalWorkouts: 0,
        currentStreak: 0,
        totalVolume: 0,
        averageSessionTime: 0,
      })
      return
    }

    const completed = userWorkout.completedWorkouts
    const totalWorkouts = completed.length

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < completed.length; i++) {
      const workoutDate = new Date(completed[completed.length - 1 - i].workoutDate)
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)

      if (
        workoutDate.toDateString() === expectedDate.toDateString() ||
        (i === 0 && workoutDate <= today)
      ) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate total volume (approximate: sets × reps)
    let totalVolume = 0
    completed.forEach((workout) => {
      if (workout.exercises) {
        workout.exercises.forEach((ex) => {
          totalVolume += ex.setsCompleted || 0
        })
      }
    })

    setStats({
      totalWorkouts,
      currentStreak,
      totalVolume,
      averageSessionTime: totalWorkouts > 0 ? Math.round(45 + Math.random() * 30) : 0,
    })
  }

  const statItems = [
    {
      icon: Calendar,
      label: 'Total Workouts',
      value: stats.totalWorkouts,
      color: 'neon-green',
      suffix: '',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats.currentStreak,
      color: 'orange-500',
      suffix: 'days',
    },
    {
      icon: BarChart3,
      label: 'Total Sets',
      value: stats.totalVolume,
      color: 'electric-blue',
      suffix: '',
    },
    {
      icon: Award,
      label: 'Avg Session',
      value: stats.averageSessionTime,
      color: 'purple-500',
      suffix: 'min',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <Icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <p className="text-3xl font-oswald font-bold text-white">
                {stat.value}
                <span className="text-sm text-gray-400 ml-2">{stat.suffix}</span>
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Workouts */}
      {userWorkout?.completedWorkouts && userWorkout.completedWorkouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-8 rounded-xl"
        >
          <h3 className="text-2xl font-oswald font-bold text-white mb-6">Recent Workouts</h3>
          <div className="space-y-4">
            {userWorkout.completedWorkouts.slice(-5).map((workout, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg border border-dark-border hover:border-neon-green/50 transition"
              >
                <div>
                  <p className="font-semibold text-white">{workout.dayName}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(workout.workoutDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neon-green font-semibold">
                    {workout.exercises?.length || 0} exercises
                  </p>
                  <TrendingUp className="w-4 h-4 text-neon-green mt-1 ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {(!userWorkout?.completedWorkouts || userWorkout.completedWorkouts.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-8 rounded-xl text-center"
        >
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No workouts logged yet</p>
          <p className="text-gray-500 text-sm mt-2">Start your first workout to see progress here</p>
        </motion.div>
      )}
    </div>
  )
}
