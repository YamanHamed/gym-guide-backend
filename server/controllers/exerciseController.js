const Exercise = require("../models/Exercise");

// GET all
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET by muscle (case‑insensitive)
const getExercisesByMuscle = async (req, res) => {
  try {
    const { muscle } = req.params;
    const exercises = await Exercise.find({ muscle: muscle.toLowerCase() });
    res.status(200).json(exercises);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching muscle group", error: error.message });
  }
};

// CREATE (admin only) – expects JSON with image URL
const createExercise = async (req, res) => {
  try {
    const {
      name,
      muscle,
      muscleHead,
      description,
      image,
      videoUrl,
      difficulty,
      links,
    } = req.body;

    if (!name || !muscle || !description || !image) {
      return res.status(400).json({
        message: "Missing required fields: name, muscle, description, image",
      });
    }

    const exerciseData = {
      name,
      muscle: muscle.toLowerCase(),
      muscleHead: muscleHead || "General",
      description,
      image, // URL from frontend (GitHub CDN)
      videoUrl: videoUrl || "",
      difficulty: difficulty || "Beginner",
      links: links || [],
    };

    const newExercise = new Exercise(exerciseData);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", error: error.message });
    }
    console.error("Error creating exercise:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// UPDATE (admin only)
const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const {
      name,
      muscle,
      muscleHead,
      description,
      image,
      videoUrl,
      difficulty,
      links,
    } = req.body;

    if (name !== undefined) exercise.name = name;
    if (muscle !== undefined) exercise.muscle = muscle.toLowerCase();
    if (muscleHead !== undefined) exercise.muscleHead = muscleHead;
    if (description !== undefined) exercise.description = description;
    if (image !== undefined) exercise.image = image;
    if (videoUrl !== undefined) exercise.videoUrl = videoUrl;
    if (difficulty !== undefined) exercise.difficulty = difficulty;
    if (links !== undefined) exercise.links = links;

    const updatedExercise = await exercise.save();
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE (admin only)
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExercise = await Exercise.findByIdAndDelete(id);
    if (!deletedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exercise", error: error.message });
  }
};

module.exports = {
  getAllExercises,
  getExercisesByMuscle,
  createExercise,
  updateExercise,
  deleteExercise,
};
