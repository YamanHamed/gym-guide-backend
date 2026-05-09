const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public

const login = async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      message: "Login successful!",
      token,
      userId: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "INTERNAL SERVER ERROR : Login error " });
  }
};

// Optional: create first admin (one‑time seed)
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const user = await User.create({ username, password, role: "admin" });
    res.status(201).json({ message: "Admin created", username: user.username });
  } catch (err) {
    console.error("Error creating admin:", err);
    res
      .status(500)
      .json({ error: "INTERNAL SERVER ERROR : Error creating admin" });
  }
};

// check if token is valid
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, createAdmin, getMe };
