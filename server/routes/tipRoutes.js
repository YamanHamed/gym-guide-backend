const express = require("express");
const {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
} = require("../controllers/tipController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllTips);
router.get("/:id", getTipById);

// Admin only routes
router.post("/", protect, createTip);
router.put("/:id", protect, updateTip);
router.delete("/:id", protect, deleteTip);

module.exports = router;
