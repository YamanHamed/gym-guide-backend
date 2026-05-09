const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tip title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Tip content is required"],
    },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tip", tipSchema);
