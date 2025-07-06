const Attendance = require("../models/attendance.model");
const ApiResponse = require("../utils/ApiResponse");

// ✅ 1. Faculty marks attendance (one document per student)
const markAttendance = async (req, res) => {
  try {
    const takenBy = req.userId; // from auth middleware
    const attendanceData = req.body; // array of records

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return ApiResponse.error("No attendance data provided", 400).send(res);
    }

    // ✅ Validate and prepare attendance documents
    const prepared = attendanceData.map((entry) => ({
      studentId: entry.studentId,
      subjectId: entry.subjectId,
      date: entry.date || new Date(),
      status: entry.isPresent ? "present" : "absent",
      takenBy,
      semester: entry.semester,
      branchId: entry.branchId,
    }));

    // ✅ Insert all at once
    await Attendance.insertMany(prepared);

    return ApiResponse.success(null, "Attendance recorded successfully").send(res);
  } catch (error) {
    console.error("Error marking attendance:", error);
    return ApiResponse.error("Failed to record attendance", 500).send(res);
  }
};

// ✅ 2. Student fetches their attendance
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId) {
      return ApiResponse.error("Student ID is required", 400).send(res);
    }

    const attendanceRecords = await Attendance.find({ studentId });

    const attendanceBySubject = {};

    attendanceRecords.forEach((record) => {
      const subjId = record.subjectId.toString();
      if (!attendanceBySubject[subjId]) {
        attendanceBySubject[subjId] = [];
      }
      attendanceBySubject[subjId].push({
        date: record.date,
        status: record.status,
      });
    });

    return ApiResponse.success(attendanceBySubject, "Student attendance fetched").send(res);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return ApiResponse.error("Failed to fetch attendance", 500).send(res);
  }
};

// ✅ 3. Faculty gets all attendance entries for a subject
const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!subjectId) {
      return ApiResponse.error("Subject ID is required", 400).send(res);
    }

    const attendance = await Attendance.find({ subjectId }).populate("studentId", "firstName lastName enrollmentNo");

    return ApiResponse.success(attendance, "Attendance fetched for subject").send(res);
  } catch (error) {
    console.error("Error fetching attendance by subject:", error);
    return ApiResponse.error("Failed to fetch attendance", 500).send(res);
  }
};


const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.userId;

    const attendanceRecords = await Attendance.find({ studentId })
      .populate("subjectId", "name code")
      .sort({ date: 1 });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return ApiResponse.success([], "No attendance records found").send(res);
    }

    const result = {};

    attendanceRecords.forEach((record) => {
      const subject = record.subjectId;
      if (!subject || !subject._id) return;

      const id = subject._id.toString();
      if (!result[id]) {
        result[id] = {
          subjectName: subject.name,
          subjectCode: subject.code,
          total: 0,
          present: 0,
          records: [],
        };
      }

      result[id].total += 1;
      if (record.status === "present") result[id].present += 1;

      result[id].records.push({ date: record.date, status: record.status });
    });

    return ApiResponse.success(Object.values(result), "Attendance fetched successfully").send(res);
  } catch (err) {
    console.error("Error in getMyAttendance:", err);
    return ApiResponse.error("Failed to fetch attendance").send(res);
  }
};


module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendanceBySubject,
  getMyAttendance,
};
