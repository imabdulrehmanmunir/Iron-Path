import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profileAPI, userAPI } from '../api/api'
import { useAuth } from '../hooks/useAuth'
import { ArrowLeft, AlertCircle, Loader, Trash2, Save } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getProfile()
      setUser(response.data.user)
      setFormData({
        age: response.data.user.age || '',
        weight: response.data.user.weight || '',
        height: response.data.user.height || '',
        gender: response.data.user.gender || '',
        activityLevel: response.data.user.activityLevel || '',
      })
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.age || !formData.weight || !formData.height || !formData.gender || !formData.activityLevel) {
      setError('All fields are required')
      return
    }

    try {
      setSubmitting(true)
      const response = await profileAPI.updateProfile({
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
        height: parseInt(formData.height),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
      })
      setUser(response.data.user)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProfile = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    try {
      setSubmitting(true)
      await profileAPI.deleteProfile()
      // Logout and redirect to landing page
      logout()
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-neon-green animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 border border-dark-border"
        >
          <h1 className="text-3xl font-oswald font-bold text-white mb-8">Edit Profile</h1>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6"
            >
              <p className="text-green-400">{success}</p>
            </motion.div>
          )}

          {/* Current Stats */}
          {user && (
            <div className="mb-8 p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
              <h2 className="text-sm text-gray-400 uppercase mb-4">Current Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">BMR</p>
                  <p className="text-lg font-bold text-neon-green">{Math.round(user.bmr)} cal</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">TDEE</p>
                  <p className="text-lg font-bold text-electric-blue">{Math.round(user.tdee)} cal</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Goal</p>
                  <p className="text-lg font-bold text-orange-500 capitalize">{user.goal}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Activity</p>
                  <p className="text-lg font-bold text-purple-500 capitalize">{user.activityLevel}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-neon-green"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Your weight in kg"
                  min="30"
                  max="300"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-neon-green"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Your height in cm"
                  min="100"
                  max="250"
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-neon-green"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-green"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Activity Level */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-white mb-2">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-green"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (intense exercise daily)</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-dark-border">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-neon-green text-black font-bold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {submitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Profile
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition ${
                  deleteConfirm
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-dark-card border border-dark-border text-gray-400 hover:border-red-500/50 hover:text-red-400'
                } disabled:opacity-50`}
              >
                <Trash2 className="w-5 h-5" />
                {deleteConfirm ? 'Confirm Delete' : 'Delete Profile'}
              </button>
            </div>

            {deleteConfirm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm">
                  ⚠️ This action cannot be undone. All your data will be permanently deleted.
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="mt-3 text-xs text-gray-400 hover:text-gray-300"
                >
                  Cancel deletion
                </button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
