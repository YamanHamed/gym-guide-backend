const Split = require("../models/Split");

// GET all splits (public)
const getAllSplits = async (req, res) => {
  try {
    const splits = await Split.find();
    res.status(200).json(splits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET split by name (case‑insensitive, public)
const getSplitsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const splits = await Split.find({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    res.status(200).json(splits);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching split", error: error.message });
  }
};

// CREATE split (admin only) – JSON only, image URLs already in place
const createSplit = async (req, res) => {
  try {
    const {
      name,
      description,
      image, // card image URL
      links,
      pageHeader,
      trainingDaysSection,
      schedulesSection,
    } = req.body;

    if (!name || !description || !image) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, description, image" });
    }

    const splitData = {
      name,
      description,
      image,
      links: links || [],
      pageHeader: pageHeader || {
        plainTitle: "",
        highlightedTitle: "",
        body: "",
        image: "",
      },
      trainingDaysSection: trainingDaysSection || {
        sectionHeader: {},
        cards: [],
      },
      schedulesSection: schedulesSection || {
        sectionHeader: {},
        accordions: [],
        tip: {},
      },
    };

    const newSplit = new Split(splitData);
    const savedSplit = await newSplit.save();
    res.status(201).json(savedSplit);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", error: error.message });
    }
    console.error("Error creating split:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// UPDATE split (admin only)
const updateSplit = async (req, res) => {
  try {
    const split = await Split.findById(req.params.id);
    if (!split) {
      return res.status(404).json({ message: "Split not found" });
    }

    const {
      name,
      description,
      image,
      links,
      pageHeader,
      trainingDaysSection,
      schedulesSection,
    } = req.body;

    if (name !== undefined) split.name = name;
    if (description !== undefined) split.description = description;
    if (image !== undefined) split.image = image;
    if (links !== undefined) split.links = links;
    if (pageHeader !== undefined) split.pageHeader = pageHeader;
    if (trainingDaysSection !== undefined)
      split.trainingDaysSection = trainingDaysSection;
    if (schedulesSection !== undefined)
      split.schedulesSection = schedulesSection;

    const updatedSplit = await split.save();
    res.json(updatedSplit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE split (admin only)
const deleteSplit = async (req, res) => {
  try {
    const deletedSplit = await Split.findByIdAndDelete(req.params.id);
    if (!deletedSplit) {
      return res.status(404).json({ message: "Split not found" });
    }
    res.status(200).json({ message: "Split deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting split", error: error.message });
  }
};

module.exports = {
  getAllSplits,
  getSplitsByName,
  createSplit,
  updateSplit,
  deleteSplit,
};
