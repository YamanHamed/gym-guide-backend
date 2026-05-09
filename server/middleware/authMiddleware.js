const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes – verifies token and attaches full user object to req.user
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Also support x-auth-token (backward compatibility)
  if (!token && req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if user still exists in DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = user; // attach full user object (including role, id)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

// Optional: restrict to admin only (already only admin exists, but good for future)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access only" });
  }
};

module.exports = { protect, adminOnly };
