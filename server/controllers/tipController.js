const Tip = require("../models/Tip");

// GET all tips ( public)
const getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET tip by Id ( public)
const getTipById = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE tip (admin only)
const createTip = async (req, res) => {
  try {
    const { title, content, image, links } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const tip = await Tip.create({ title, content, image, links });
    res.status(201).json(tip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// UPDATE tip (admin only)
const updateTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });

    const { title, content, image, links } = req.body;
    if (title !== undefined) tip.title = title;
    if (content !== undefined) tip.content = content;
    if (image !== undefined) tip.image = image;
    if (links !== undefined) tip.links = links;

    const updatedTip = await tip.save();
    res.json(updatedTip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// DELETE tip (admin only)
const deleteTip = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).json({ message: "Tip not found" });
    await tip.deleteOne();
    res.json({ message: "Tip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip,
};
