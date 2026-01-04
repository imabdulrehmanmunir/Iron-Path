import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    // Auth Details
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Physical Stats (filled during onboarding)
    age: Number,
    weight: Number, // kg
    height: Number, // cm
    gender: String, // Male, Female, Other
    activityLevel: String, // Sedentary, Light, Moderate, Active, VeryActive
    goal: String, // Cut, Bulk, Maintain

    // Calculated Values
    bmr: Number, // Basal Metabolic Rate
    tdee: Number, // Total Daily Energy Expenditure

    // Progress
    daysCompleted: {
      type: Number,
      default: 0,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')){
    return next();
  } 
  this.password = await bcryptjs.hash(this.password, 10)
  next()
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)
