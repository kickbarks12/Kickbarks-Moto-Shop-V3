const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/me", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const user = await User.findById(req.session.userId).select("-password");
  res.json(user);
});

// ADD / REMOVE WISHLIST
router.post("/wishlist/:productId", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const user = await User.findById(req.session.userId);
  const productId = req.params.productId;

  const index = user.wishlist.indexOf(productId);

  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();
  res.json(user.wishlist);
});

// GET WISHLIST
router.get("/wishlist", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const user = await User.findById(req.session.userId)
    .populate("wishlist");

  res.json(user.wishlist);
});

// GET WISHLIST IDS ONLY
router.get("/wishlist-ids", async (req, res) => {
  if (!req.session.userId) return res.json([]);

  const user = await User.findById(req.session.userId);
  res.json(user.wishlist.map(id => id.toString()));
});

module.exports = router;
