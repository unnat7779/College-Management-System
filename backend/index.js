const connectToMongo = require("./Database/db")
const express = require("express")
const app = express()
const path = require("path")

// Connect to MongoDB
connectToMongo()

// Load environment variables
require("dotenv").config()

const cors = require("cors")
const attendanceRoutes = require("./routes/attendance.route")

// CORS configuration
app.use(cors({
  origin: "*",
}));


// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/attendance", attendanceRoutes)

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "College Management API is running! 🚀",
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
})

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// Static files
app.use("/media", express.static(path.join(__dirname, "media")))

// API Routes
app.use("/api/admin", require("./routes/details/admin-details.route"))
app.use("/api/faculty", require("./routes/details/faculty-details.route"))
app.use("/api/student", require("./routes/details/student-details.route"))

app.use("/api/branch", require("./routes/branch.route"))
app.use("/api/subject", require("./routes/subject.route"))
app.use("/api/notice", require("./routes/notice.route"))
app.use("/api/timetable", require("./routes/timetable.route"))

app.use("/api/attendance", require("./routes/attendance.route"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const port = process.env.PORT || 4000

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server Listening On http://localhost:${port}`)
  })
}

// Export for Vercel
module.exports = app
