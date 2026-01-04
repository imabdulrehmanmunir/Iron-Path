import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected')

    // Delete all users
    const result = await mongoose.connection.collection('users').deleteMany({})
    console.log(`✅ Deleted ${result.deletedCount} users`)

    // Also delete related data
    await mongoose.connection.collection('diets').deleteMany({})
    console.log('✅ Deleted all diet records')

    await mongoose.connection.collection('userworkouts').deleteMany({})
    console.log('✅ Deleted all workout records')

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

export default deleteAllUsers;
