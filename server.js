const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "kickbarks_secret",
    resave: false,
    saveUninitialized: false
  })
);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// Root = homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Kickbarks ecommerce running on http://localhost:${PORT}`);
});
