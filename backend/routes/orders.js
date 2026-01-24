const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();
const sendReceiptEmail = require("../utils/sendReceiptEmail");
const generateReceiptPDF = require("../utils/generateReceiptPDF");


router.post("/", async (req, res) => {
  try {
    // 1️⃣ Auth check
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items" });
    }

    // 2️⃣ Load user
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 3️⃣ Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      return sum + price * qty;
    }, 0);

    // ✅ FIX: define finalTotal
    const finalTotal = subtotal;

    // 4️⃣ Create order
    const order = await Order.create({
      
      userId: user._id,
      items,
      total: finalTotal,
      status: "Pending",
      date: new Date()
    });
sendReceiptEmail(order, user.email);

    res.json({
      success: true,
      orderId: order._id,
      finalTotal
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order processing failed" });
    
  }
});

// GET USER ORDERS
router.get("/", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();
  res.json(await Order.find({ userId: req.session.userId }));
});

// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  if (!req.session.userId) return res.status(401).end();

  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!order) return res.status(404).end();

  res.json(order);
});
router.get("/:id/receipt", async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).send("Invalid order ID");
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).send("Order not found");
  }

  generateReceiptPDF(order, res);
});

module.exports = router;






