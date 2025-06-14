/*1st

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/



/*2nd

// Load required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // to accept JSON data

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
*/

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
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Auth routes
app.use('/api/auth', require('./routes/auth'));

// ✅ Budget routes (🔑 THIS IS THE LINE YOU ADD)
app.use('/api/budget', require('./routes/budget'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
