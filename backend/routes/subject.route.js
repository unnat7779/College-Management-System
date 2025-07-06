const express = require("express");
const {
  getSubjectController,
  addSubjectController,
  deleteSubjectController,
  updateSubjectController,
  getMySubjectsController,
} = require("../controllers/subject.controller");

const router = express.Router();
const auth = require("../middlewares/auth.middleware");


router.get("/", auth, getSubjectController);
router.post("/", auth, addSubjectController);
router.delete("/:id", auth, deleteSubjectController);


router.patch("/:id", auth, updateSubjectController);


router.get("/faculty", auth, getMySubjectsController);

module.exports = router;
