const express = require("express");
const Exercise = require("../models/Exercise");
const Split = require("../models/Split");

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Search query is required" });
  }

  const searchTerm = q.trim();
  const regex = new RegExp(searchTerm, "i");

  try {
    const exercises = await Exercise.find({
      $or: [
        { name: regex },
        { description: regex },
        { muscle: regex },
        { muscleHead: regex },
      ],
    })
      .select("name description image muscle muscleHead")
      .limit(10);

    const splits = await Split.find({
      $or: [{ name: regex }, { description: regex }],
    })
      .select("name description image")
      .limit(10);

    // Format results – no frontend URLs
    const results = [
      ...exercises.map((ex) => ({
        type: "exercise",
        id: ex._id,
        name: ex.name,
        description: ex.description,
        image: ex.image,
        muscle: ex.muscle,
        muscleHead: ex.muscleHead,
      })),
      ...splits.map((split) => ({
        type: "split",
        id: split._id,
        name: split.name,
        description: split.description,
        image: split.image,
      })),
    ];

    res.json({ results, query: searchTerm });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
