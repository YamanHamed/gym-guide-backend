const Exercise = require("../models/Exercise");

// GET all
const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ importance: -1, name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET by muscle (case‑insensitive)
const getExercisesByMuscle = async (req, res) => {
  try {
    const { muscle } = req.params;
    const exercises = await Exercise.find({
      muscle: muscle.toLowerCase(),
    }).sort({ importance: -1, name: 1 });
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
      name_ar,
      muscle,
      muscle_ar,
      muscleHead,
      muscleHead_ar,
      description,
      description_ar,
      image,
      videoUrl,
      difficulty,
      links,
      importance,
    } = req.body;

    if (!name || !muscle || !description) {
      return res.status(400).json({
        message: "Missing required fields: name, muscle, description, image",
      });
    }

    const exerciseData = {
      name,
      name_ar: name_ar || "",
      muscle: muscle.toLowerCase(),
      muscle_ar: muscle_ar || "",
      muscleHead: muscleHead || "General",
      muscleHead_ar: muscleHead_ar || "",
      description,
      description_ar: description_ar || "",
      image,
      videoUrl: videoUrl || "",
      difficulty: difficulty || "Beginner",
      links: (links || []).map((link) => ({
        label: link.label,
        label_ar: link.label_ar || "",
        url: link.url,
      })),
      importance: importance || 5,
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
      name_ar,
      muscle,
      muscle_ar,
      muscleHead,
      muscleHead_ar,
      description,
      description_ar,
      image,
      videoUrl,
      difficulty,
      links,
      importance,
    } = req.body;

    if (name !== undefined) exercise.name = name;
    if (name_ar !== undefined) exercise.name_ar = name_ar;
    if (muscle !== undefined) exercise.muscle = muscle.toLowerCase();
    if (muscle_ar !== undefined) exercise.muscle_ar = muscle_ar;
    if (muscleHead !== undefined) exercise.muscleHead = muscleHead;
    if (muscleHead_ar !== undefined) exercise.muscleHead_ar = muscleHead_ar;
    if (description !== undefined) exercise.description = description;
    if (description_ar !== undefined) exercise.description_ar = description_ar;
    if (image !== undefined) exercise.image = image;
    if (videoUrl !== undefined) exercise.videoUrl = videoUrl;
    if (difficulty !== undefined) exercise.difficulty = difficulty;
    if (links !== undefined) {
      exercise.links = links.map((link) => ({
        label: link.label,
        label_ar: link.label_ar || "",
        url: link.url,
      }));
    }
    if (importance !== undefined) exercise.importance = importance;

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
