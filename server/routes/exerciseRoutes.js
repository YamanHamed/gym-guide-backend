const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const { protect } = require("../middleware/authMiddleware"); // ← ADD

// Public routes (anyone can view)
router.get("/", exerciseController.getAllExercises);
router.get("/:muscle", exerciseController.getExercisesByMuscle);

// Protected routes (admin only)
router.post("/", protect, exerciseController.createExercise);
router.put("/:id", protect, exerciseController.updateExercise);
router.delete("/:id", protect, exerciseController.deleteExercise);

module.exports = router;
