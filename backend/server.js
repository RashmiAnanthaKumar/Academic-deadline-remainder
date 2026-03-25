const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: "*", // allow all (for now)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

app.use("/api/submissions", submissionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// serve files
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌:", err.message));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});