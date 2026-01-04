import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import programRoutes from './routes/programs.js'
import exerciseRoutes from './routes/exercises.js'
import dietRoutes from './routes/diet.js'
import { errorHandler } from './middleware/errorHandler.js'
import deleteAllUsers from './deleteAllUsers.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect Database
connectDB()
// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/programs', programRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api', dietRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// Error handling middleware (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})
