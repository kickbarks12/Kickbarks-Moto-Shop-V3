const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();

  const result = products.map(p => {
    const reviews = p.reviews || [];
    const count = reviews.length;
    const avg =
      count === 0
        ? 0
        : reviews.reduce((s, r) => s + r.rating, 0) / count;

    return {
      ...p.toObject(),
      ratingAvg: avg,
      ratingCount: count
    };
  });

  res.json(result);
});


// GET SINGLE PRODUCT BY ID (THIS FIXES YOUR ERROR)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product ID" });
  }
});

// ADD REVIEW
router.post("/:id/reviews", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).end();

  const existing = product.reviews.find(
    r => r.userId.toString() === req.session.userId
  );

  if (existing) {
    // UPDATE REVIEW
    existing.rating = req.body.rating;
    existing.comment = req.body.comment;
    existing.date = new Date();
  } else {
    // ADD REVIEW
    product.reviews.push({
      userId: req.session.userId,
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment
    });
  }

  await product.save();
  res.json(product.reviews);
});

router.delete("/:id/reviews", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).end();

  product.reviews = product.reviews.filter(
    r => r.userId.toString() !== req.session.userId
  );

  await product.save();
  res.json(product.reviews);
});

module.exports = router;
