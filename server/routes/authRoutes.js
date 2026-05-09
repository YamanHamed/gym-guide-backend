const express = require("express");
const { login, createAdmin, getMe } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Login – public
router.post("/login", loginLimiter, login);

// create-admin - protected
router.post(
  "/create-admin",
  (req, res, next) => {
    if (
      process.env.ADMIN_SECRET_KEY &&
      req.headers["admin-secret"] === process.env.ADMIN_SECRET_KEY
    ) {
      next();
    } else {
      res.status(403).json({ error: "Not allowed" });
    }
  },
  createAdmin,
);

router.get("/me", protect, getMe);
module.exports = router;
