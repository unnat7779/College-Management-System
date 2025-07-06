const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentDetail", // ✅ Correct model name
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // ✅ Correct model name
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
  takenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FacultyDetail", // ✅ Correct model name
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // ✅ Correct model name
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
