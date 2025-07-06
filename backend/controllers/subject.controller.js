const Subject = require("../models/subject.model");
const Faculty = require("../models/details/faculty-details.model");

const ApiResponse = require("../utils/ApiResponse");

const getSubjectController = async (req, res) => {
  try {
    const { branchId, semester } = req.query;
    let query = {};
    if (branchId) query.branchId = branchId;
    if (semester) query.semester = semester;

    // Populate both faculty and branch
    const subjects = await Subject.find(query)
      .populate("branchId", "name")
      .populate("facultyId", "firstName lastName");

    if (!subjects || subjects.length === 0) {
      return ApiResponse.error("No Subjects Found", 404).send(res);
    }

    return ApiResponse.success(subjects, "All Subjects Loaded!").send(res);
  } catch (error) {
    console.error("Error loading subjects:", error);
    return ApiResponse.error(error.message).send(res);
  }
};



const addSubjectController = async (req, res) => {
  const { name, code, branchId, semester, credits, facultyId } = req.body;

  // Step 1: Validate all fields
  if (!name || !code || !branchId || !semester || !credits || !facultyId) {
    return ApiResponse.error("All fields are required", 400).send(res);
  }

  try {
    // Step 2: Check for duplicate subject code
    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
      return ApiResponse.error("Subject Already Exists", 409).send(res);
    }

    // Step 3: Create subject with all required fields
    const newSubject = await Subject.create({
      name,
      code,
      branchId,
      semester,
      credits,
      facultyId,
    });

    return ApiResponse.created(newSubject, "Subject Added Successfully!").send(res);
  } catch (error) {
    console.error("Error adding subject:", error);
    return ApiResponse.error(error.message).send(res);
  }
};


const updateSubjectController = async (req, res) => {
  const { name, code, branchId, semester, credits, facultyId } = req.body;
  const updateFields = {};

  if (name) updateFields.name = name;
  if (code) updateFields.code = code;
  if (branchId) updateFields.branchId = branchId;
  if (semester) updateFields.semester = semester;
  if (credits) updateFields.credits = credits;
  if (facultyId) updateFields.facultyId = facultyId;

  if (Object.keys(updateFields).length === 0) {
    return ApiResponse.error("No fields provided for update", 400).send(res);
  }

  try {
    let subject = await Subject.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });

    if (!subject) {
      return ApiResponse.error("Subject Not Found!", 404).send(res);
    }

    return ApiResponse.success(subject, "Subject Updated Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const deleteSubjectController = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiResponse.error("Subject ID is required", 400).send(res);
    }

    let subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return ApiResponse.error("Subject Not Found!", 404).send(res);
    }
    return ApiResponse.success(null, "Subject Deleted Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};



const getMySubjectsController = async (req, res) => {
  try {
    const facultyId = req.userId;
    const subjects = await Subject.find({ facultyId })
      .populate("branchId", "name")
      .populate("facultyId", "firstName lastName");

    return ApiResponse.success(subjects, "Subjects fetched successfully").send(res);
  } catch (error) {
    console.error("Error in getMySubjectsController:", error);
    return ApiResponse.error("Failed to fetch subjects").send(res);
  }
};




module.exports = {
  getSubjectController,
  addSubjectController,
  deleteSubjectController,
  updateSubjectController,
  getMySubjectsController,
};
