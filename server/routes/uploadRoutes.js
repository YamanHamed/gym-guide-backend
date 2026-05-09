const express = require("express");
const multer = require("multer");
const { uploadImageToGitHub } = require("../services/githubServices");

const router = express.Router();

// Configure multer (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// POST /api/upload - single file with field name "image"
router.post("/", upload.any(), async (req, res) => {
  try {
    console.log("Received files:", req.files); // ← debug: see all files
    console.log("Received body:", req.body); // ← debug: see extra fields

    const file = req.files?.[0];
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = await uploadImageToGitHub(file.buffer, file.originalname);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
module.exports = router;
