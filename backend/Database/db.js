require("dotenv").config()
const mongoose = require("mongoose")

const mongoURI = process.env.MONGODB_URI

let isConnected = false

const connectToMongo = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB")
    return
  }

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      // ❌ Removed bufferMaxEntries, it's not supported in MongoDB driver v4+
    }

    await mongoose.connect(mongoURI, options)
    isConnected = true
    console.log("Connected to MongoDB Successfully")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected")
  isConnected = false
})

module.exports = connectToMongo
