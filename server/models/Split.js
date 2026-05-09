// models/Split.js
const mongoose = require("mongoose");

const pageHeaderSchema = new mongoose.Schema({
  plainTitle: { type: String, default: "" },
  highlightedTitle: { type: String, default: "" },
  body: { type: String, default: "" },
  image: { type: String, default: "" }, // CDN URL
});

const trainingDayCardSchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Push Day"
  body: { type: String, required: true }, // "Chest, shoulders, triceps"
  image: { type: String, default: "" }, // optional card image
});

const scheduleExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Bench Press"
  webName: { type: String, default: "" }, // for navigation / slug
});

const trainingDaySchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Push Day"
  subTitle: { type: String, default: "" }, // e.g., "Strength focus"
  exercises: [scheduleExerciseSchema],
});

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Split‑1", "Split‑2", etc.
  trainingDays: [trainingDaySchema],
});

const tipSchema = new mongoose.Schema({
  body: { type: String, default: "" },
  externalUrl: { type: String, default: "" },
});

const splitSchema = new mongoose.Schema(
  {
    // Basic info (still needed for listing cards)
    name: {
      type: String,
      required: [true, "Split name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // card image (list view)
    },
    links: [
      {
        label: String,
        url: String,
      },
    ],

    // Detailed page content
    pageHeader: pageHeaderSchema,

    trainingDaysSection: {
      sectionHeader: pageHeaderSchema, // reusing the same structure (without image maybe)
      cards: [trainingDayCardSchema],
    },

    schedulesSection: {
      sectionHeader: pageHeaderSchema,
      accordions: [scheduleSchema],
      tip: tipSchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Split", splitSchema);
