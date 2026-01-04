import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { userAPI } from '../../api/api'
import { ChevronRight, ChevronLeft, AlertCircle, Zap } from 'lucide-react'

const steps = [
  { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter your age', min: 13, max: 120 },
  {
    id: 'weight',
    label: 'Weight (kg)',
    type: 'number',
    placeholder: 'Enter your weight',
    min: 30,
    max: 300,
  },
  {
    id: 'height',
    label: 'Height (cm)',
    type: 'number',
    placeholder: 'Enter your height',
    min: 100,
    max: 250,
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'select',
    options: ['Male', 'Female', 'Other'],
  },
  {
    id: 'activityLevel',
    label: 'Activity Level',
    type: 'select',
    options: ['Sedentary', 'Light', 'Moderate', 'Active', 'VeryActive'],
    descriptions: {
      Sedentary: 'Little or no exercise',
      Light: 'Exercise 1-3 days/week',
      Moderate: 'Exercise 3-5 days/week',
      Active: 'Exercise 6-7 days/week',
      VeryActive: 'Physical job or training twice per day',
    },
  },
  {
    id: 'goal',
    label: 'Goal',
    type: 'select',
    options: ['Cut', 'Bulk', 'Maintain'],
    descriptions: {
      Cut: 'Lose fat & define muscles',
      Bulk: 'Gain muscle mass',
      Maintain: 'Keep current physique',
    },
  },
]

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const step = steps[currentStep]

  const handleChange = (e) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, [step.id]: value }))
    setError('')
  }

  const validateStep = () => {
    const value = formData[step.id]

    if (!value) {
      setError(`Please enter your ${step.label.toLowerCase()}`)
      return false
    }

    if (step.type === 'number') {
      const num = Number(value)
      if (num < step.min || num > step.max) {
        setError(`${step.label} must be between ${step.min} and ${step.max}`)
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        setError('')
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      const response = await userAPI.onboard(formData)
      setUser(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Onboarding failed')
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-oswald font-bold text-white mb-2">Let's Get Started</h1>
          <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-dark-border rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-neon-green transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Form Card */}
        <div className="glass p-8 rounded-xl">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Question */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-white mb-4">{step.label}</label>

            {step.type === 'number' && (
              <input
                type="number"
                value={formData[step.id]}
                onChange={handleChange}
                placeholder={step.placeholder}
                min={step.min}
                max={step.max}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green text-lg"
              />
            )}

            {step.type === 'select' && (
              <div className="space-y-2">
                {step.options.map((option) => (
                  <div key={option}>
                    <label className="flex items-center p-3 border border-dark-border rounded-lg cursor-pointer hover:border-neon-green/50 transition">
                      <input
                        type="radio"
                        name={step.id}
                        value={option}
                        checked={formData[step.id] === option}
                        onChange={handleChange}
                        className="w-5 h-5 cursor-pointer accent-neon-green"
                      />
                      <span className="ml-3 text-white flex-grow">{option}</span>
                      {step.descriptions?.[option] && (
                        <span className="text-xs text-gray-500">{step.descriptions[option]}</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || loading}
              className="flex-1 flex items-center justify-center gap-2 border border-dark-border text-gray-300 py-2.5 rounded-lg hover:border-neon-green/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!formData[step.id] || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-neon-green text-black font-semibold py-2.5 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData[step.id] || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-neon-green text-black font-semibold py-2.5 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Zap className="w-5 h-5" />
                    Complete
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          We use this data to calculate your BMR & TDEE
        </p>
      </div>
    </div>
  )
}
