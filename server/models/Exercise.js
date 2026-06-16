const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Exercise name is required"],
    trim: true,
  },
  name_ar: { type: String, default: "" },

  muscle: { type: String, required: true, lowercase: true },
  muscle_ar: { type: String, default: "" },

  muscleHead: { type: String, default: "General" },
  muscleHead_ar: { type: String, default: "" },

  description: { type: String, required: true },
  description_ar: { type: String, default: "" },

  links: [
    {
      label: { type: String, required: true },
      label_ar: { type: String, default: "" },
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
  importance: { type: Number, default: 5, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exercise", exerciseSchema);
