const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Exercise name is required"],
    trim: true,
  },
  muscle: {
    type: String,
    required: true,
    lowercase: true,
  },
  muscleHead: {
    type: String,
    default: "General",
  },
  description: { type: String, required: true },
  links: [
    {
      label: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  image: { type: String },
  videoUrl: { type: String },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
