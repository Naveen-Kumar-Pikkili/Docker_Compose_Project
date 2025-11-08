const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(express.json());

// Environment variables from docker-compose
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mydb";
const AUTH_URL = process.env.AUTH_URL || "http://localhost:6000";
const NOTIFY_URL = process.env.NOTIFY_URL || "http://localhost:7000";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// Example: communicate with Auth service
app.get("/auth/check", async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_URL}/status`);
    res.json({ auth_service: response.data });
  } catch (err) {
    res.status(500).json({ error: "Auth service not reachable" });
  }
});

// Example: communicate with Notification service
app.post("/notify", async (req, res) => {
  try {
    const response = await axios.post(`${NOTIFY_URL}/send`, {
      message: "Hello from Backend 👋",
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Notification service not reachable" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
