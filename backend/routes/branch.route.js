const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  getBranchController,
  addBranchController,
  updateBranchController,
  deleteBranchController,
  getAllBranches,
} = require("../controllers/branch.controller");

router.get("/", auth, getBranchController);
router.post("/", auth, addBranchController);
router.patch("/:id", auth, updateBranchController);
router.delete("/:id", auth, deleteBranchController);
router.get("/", getAllBranches);

module.exports = router;
