const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leadRoutes = require("./routes/leadRoutes");
const tagRoutes = require("./routes/tagRoutes");
const noteRoutes = require("./routes/noteRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityRoutes = require("./routes/activityRoutes");

// Load .env file
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activitylogs", activityRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Lead Management API is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});
