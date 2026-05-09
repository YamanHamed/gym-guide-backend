const express = require("express");
const router = express.Router();
const splitController = require("../controllers/splitController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", splitController.getAllSplits);
router.get("/:name", splitController.getSplitsByName);

// Protected routes (admin only)
router.post("/", protect, splitController.createSplit);
router.put("/:id", protect, splitController.updateSplit);
router.delete("/:id", protect, splitController.deleteSplit);

module.exports = router;
