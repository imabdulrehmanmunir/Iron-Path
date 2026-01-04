import { createContext, useState, useEffect } from 'react'
import { authAPI, userAPI } from '../api/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await userAPI.getProfile()
      setUser(response.data.user)
      setError(null)
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authAPI.login(email, password)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, message }
    }
  }

  const signup = async (name, email, password, confirmPassword) => {
    try {
      setError(null)
      const response = await authAPI.signup(name, email, password, confirmPassword)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed'
      setError(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    setError(null)
  }

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    loading,
    error,
    setError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
