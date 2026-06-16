const mongoose = require("mongoose");

const pageHeaderSchema = new mongoose.Schema({
  plainTitle: { type: String, default: "" },
  plainTitle_ar: { type: String, default: "" },
  highlightedTitle: { type: String, default: "" },
  highlightedTitle_ar: { type: String, default: "" },
  body: { type: String, default: "" },
  body_ar: { type: String, default: "" },
  image: { type: String, default: "" }, // image URL doesn't need translation
});

const trainingDayCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_ar: { type: String, default: "" },
  body: { type: String, required: true },
  body_ar: { type: String, default: "" },
  image: { type: String, default: "" },
});

const scheduleExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ar: { type: String, default: "" },
  webName: { type: String, default: "" }, // slug, not translated
  muscle: { type: String, required: true },
  muscle_ar: { type: String, default: "" },
});

const trainingDaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_ar: { type: String, default: "" },
  subTitle: { type: String, default: "" },
  subTitle_ar: { type: String, default: "" },
  exercises: [scheduleExerciseSchema],
});

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_ar: { type: String, default: "" },
  trainingDays: [trainingDaySchema],
});

const tipSchema = new mongoose.Schema({
  body: { type: String, default: "" },
  body_ar: { type: String, default: "" },
  externalUrl: { type: String, default: "" },
});

const splitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    name_ar: { type: String, default: "" },
    daysAWeek: { type: [Number], default: [] },
    description: { type: String, required: true },
    description_ar: { type: String, default: "" },
    image: { type: String },
    links: [{ label: String, url: String }], // optionally add label_ar if needed
    importance: { type: Number, default: 5, min: 1, max: 10 },

    pageHeader: pageHeaderSchema,

    trainingDaysSection: {
      sectionHeader: pageHeaderSchema,
      cards: [trainingDayCardSchema],
    },

    schedulesSection: {
      sectionHeader: pageHeaderSchema,
      schedules: [scheduleSchema],
      tip: tipSchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Split", splitSchema);
