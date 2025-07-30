const { Types }  = require("mongoose");
const  Product  = require("../models/productsModel.js");
const Order  =  require("../models/orderModel.js");
const User  = require("../models/userModel.js");

// POST /order/place

const addOrders = async (req, res) => {
  const { items, totalAmount, shipping } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  if (
    !shipping ||
    !shipping.name ||
    !shipping.address ||
    !shipping.city ||
    !shipping.zip
  ) {
    return res
      .status(400)
      .json({ message: "Shipping details are incomplete." });
  }
  if (totalAmount === undefined || totalAmount <= 0) {
    return res.status(400).json({ message: "Invalid total amount." });
  }
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated." });
  }
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items must be an array." });
  } 
  if (items.some((item) => !item._id || !item.name || !item.qty || !item.price)) {
    return res
      .status(400)
      .json({ message: "Each item must have an id, name, quantity, and price." });
  }
  if (items.some((item) => item.qty <= 0)) {
    return res.status(400).json({ message: "Quantity must be greater than zero." });
  }
  try {
    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item._id || item.id);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      product.stock -= item.qty;
      await product.save();
    }

    const estimatedDelivery = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000); // 6 days from now

    const newOrder = new Order({
      userId: req.user._id,
      items: items.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        image: item.image,
        qty: item.qty,
        price: item.price,
      })),
      totalAmount,
      shipping,
      estimatedDelivery,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server error , while placing the order." });
  }
};


// GET /orders
const getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email address");

    const orders = await Order.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ user, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

// GET /admin/orders
const getOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email city pincode");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      userId: orders.map((order) => order.userId._id),
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /admin/order/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID" });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports  = {
  addOrders,
  getOrders,
  getOrderById,
  getOrdersAdmin,
  updateOrderStatus,
};
