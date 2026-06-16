const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tip title is required"],
      trim: true,
    },
    title_ar: { type: String, default: "" },

    content: { type: String, required: [true, "Tip content is required"] },
    content_ar: { type: String, default: "" },

    image: { type: String, default: "" }, // added missing field

    links: [
      {
        label: { type: String, required: true },
        label_ar: { type: String, default: "" },
        url: { type: String, required: true },
      },
    ],

    tags: { type: [String], default: ["general"] },
    tags_ar: { type: [String], default: [] }, // optional, for translated categories

    createdAt: { type: Date, default: Date.now },
    importance: { type: Number, default: 5, min: 1, max: 10 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tip", tipSchema);
