const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, ".env") });
}
const mongoose = require("mongoose");

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ========== ROUTES ==========
const exerciseRoutes = require("./routes/exerciseRoutes");
app.use("/api/exercises", exerciseRoutes);

const splitRoutes = require("./routes/splitRoutes");
app.use("/api/splits", splitRoutes);

const tipRoutes = require("./routes/tipRoutes");
app.use("/api/tips", tipRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ========== GLOBAL ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// ========== MONGODB CONNECTION ==========
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ========== SERVER CONNECTION ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});

// ========== SHUTDOWN HANDLER ==========
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
  process.exit(0);
});
