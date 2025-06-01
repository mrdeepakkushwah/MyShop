// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { userId, products, total } = req.body;

    const newOrder = new Order({
      userId,
      products,
      total,
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: "Order failed." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch orders." });
  }
});
  

module.exports = router;
