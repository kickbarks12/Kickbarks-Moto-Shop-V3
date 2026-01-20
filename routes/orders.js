const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const items = req.body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const user = await User.findById(req.session.userId);

    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return sum + price * qty;
    }, 0);

    // Use vouchers
    const voucherUsed = Math.min(user.vouchers, subtotal);
    const finalTotal = subtotal - voucherUsed;

    // Earn vouchers
    const voucherEarned = Math.floor(finalTotal / 1000) * 50;

    user.vouchers = user.vouchers - voucherUsed + voucherEarned;
    await user.save();

    const order = await Order.create({
      userId: user._id,
      items,
      total: finalTotal,
      status: "Pending"
    });

    res.json({
      order,
      finalTotal,
      voucherUsed,
      voucherEarned
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order processing failed" });
  }
});



router.get("/", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  res.json(await Order.find({ userId: req.session.userId }));
});

router.get("/:id", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!order) return res.status(404).end();

  res.json(order);
});

module.exports = router;
