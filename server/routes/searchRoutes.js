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
        { name_ar: regex },
        { description: regex },
        { description_ar: regex },
        { muscle: regex },
        { muscle_ar: regex },
        { muscleHead: regex },
        { muscleHead_ar: regex },
      ],
    })
      .select(
        "name name_ar description description_ar image muscle muscle_ar muscleHead muscleHead_ar",
      )
      .limit(10);

    const splits = await Split.find({
      $or: [
        { name: regex },
        { name_ar: regex },
        { description: regex },
        { description_ar: regex },
      ],
    })
      .select("name name_ar description description_ar image")
      .limit(10);

    const results = [
      ...exercises.map((ex) => ({
        type: "exercise",
        id: ex._id,
        name: ex.name,
        name_ar: ex.name_ar,
        description: ex.description,
        description_ar: ex.description_ar,
        image: ex.image,
        muscle: ex.muscle,
        muscle_ar: ex.muscle_ar,
        muscleHead: ex.muscleHead,
        muscleHead_ar: ex.muscleHead_ar,
      })),
      ...splits.map((split) => ({
        type: "split",
        id: split._id,
        name: split.name,
        name_ar: split.name_ar,
        description: split.description,
        description_ar: split.description_ar,
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
