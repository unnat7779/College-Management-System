const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  markAttendance,
  getStudentAttendance,
  getAttendanceBySubject,
  getMyAttendance,
} = require("../controllers/attendance.controller");

// ✅ Route used by faculty to mark attendance
router.post("/", auth, markAttendance);

// Other routes (optional)
router.get("/student/:studentId", auth, getStudentAttendance);
router.get("/subject/:subjectId", auth, getAttendanceBySubject);


router.get("/my", auth, getMyAttendance); // Add this line

module.exports = router;
