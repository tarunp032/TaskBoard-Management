const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/user", require("./routes/userRoutes")); // User routes
app.use("/api/task", require("./routes/taskRoutes")); // Task routes
app.use("/api/subtask", require("./routes/subTaskRoutes")); // Sub-task routes
app.use("/api", require("./routes/uploadRoutes"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "TaskBoard API Server Running 🚀" });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
