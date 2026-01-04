import axios from 'axios'

const API_URL = "https://iron-path.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  signup: (name, email, password, confirmPassword) =>
    api.post('/auth/signup', { name, email, password, confirmPassword }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  onboard: (userData) => api.put('/user/onboard', userData),
}

export const programAPI = {
  getAllPrograms: () => api.get('/programs'),
  getProgramById: (id) => api.get(`/programs/${id}`),
  selectProgram: (id) => api.post(`/programs/${id}/select`),
  getCurrentProgram: () => api.get('/programs/user/current'),
  completeWorkout: (workoutData) => api.post('/programs/user/complete', workoutData),
  cancelProgram: () => api.post('/programs/user/cancel'),
}

export const exerciseAPI = {
  getAllExercises: (filters) => api.get('/exercises', { params: filters }),
  getExerciseById: (id) => api.get(`/exercises/${id}`),
  getExercisesByCategory: (category) => api.get(`/exercises/category/${category}`),
}

export const dietAPI = {
  createDiet: (dietData) => api.post('/diet', dietData),
  getCurrentDiet: () => api.get('/diet'),
  trackMeal: (mealData) => api.post('/diet/meal', mealData),
}

export const profileAPI = {
  updateProfile: (data) => api.patch('/user/profile', data),
  deleteProfile: () => api.delete('/user'),
}

export default api

