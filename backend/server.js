
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Accept JSON

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(" MongoDB connected successfully");
})
.catch((err) => {
  console.error(" MongoDB connection error:", err.message);
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//  Auth routes
app.use('/api/auth', require('./routes/auth'));

//  Budget routes ( THIS IS THE LINE YOU ADD)
app.use('/api/budget', require('./routes/budget'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
