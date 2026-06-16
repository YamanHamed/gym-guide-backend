const Split = require("../models/Split");

// GET all splits (public)
const getAllSplits = async (req, res) => {
  try {
    const splits = await Split.find().sort({ importance: -1, name: 1 });
    res.status(200).json(splits);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET split by name (case‑insensitive, public)
const getSplitsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const split = await Split.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (!split) {
      return res.status(404).json({ message: "Split not found" });
    }
    res.status(200).json(split);
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
      name_ar,
      daysAWeek,
      description,
      description_ar,
      image,
      links,
      pageHeader,
      trainingDaysSection,
      schedulesSection,
      importance,
    } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, description, image" });
    }

    const splitData = {
      name,
      name_ar: name_ar || "",
      daysAWeek: daysAWeek || [],
      description,
      description_ar: description_ar || "",
      image,
      links: links || [],
      pageHeader: pageHeader || {
        plainTitle: "",
        plainTitle_ar: "",
        highlightedTitle: "",
        highlightedTitle_ar: "",
        body: "",
        body_ar: "",
        image: "",
      },
      trainingDaysSection: trainingDaysSection || {
        sectionHeader: {
          plainTitle: "",
          plainTitle_ar: "",
          highlightedTitle: "",
          highlightedTitle_ar: "",
          body: "",
          body_ar: "",
          image: "",
        },
        cards: [],
      },
      schedulesSection: schedulesSection || {
        sectionHeader: {
          plainTitle: "",
          plainTitle_ar: "",
          highlightedTitle: "",
          highlightedTitle_ar: "",
          body: "",
          body_ar: "",
          image: "",
        },
        schedules: [],
        tip: { body: "", body_ar: "", externalUrl: "" },
      },
      importance: importance || 5,
    };

    const newSplit = new Split(splitData);
    const savedSplit = await newSplit.save();
    res.status(201).json(savedSplit);
  } catch (error) {
    // error handling unchanged
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
      name_ar,
      daysAWeek,
      description,
      description_ar,
      image,
      links,
      pageHeader,
      trainingDaysSection,
      schedulesSection,
      importance,
    } = req.body;

    if (name !== undefined) split.name = name;
    if (name_ar !== undefined) split.name_ar = name_ar;
    if (daysAWeek !== undefined) split.daysAWeek = daysAWeek;
    if (description !== undefined) split.description = description;
    if (description_ar !== undefined) split.description_ar = description_ar;
    if (image !== undefined) split.image = image;
    if (links !== undefined) split.links = links;
    if (pageHeader !== undefined) split.pageHeader = pageHeader;
    if (trainingDaysSection !== undefined)
      split.trainingDaysSection = trainingDaysSection;
    if (schedulesSection !== undefined)
      split.schedulesSection = schedulesSection;
    if (importance !== undefined) split.importance = importance;

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
