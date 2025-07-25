
import { Types } from "mongoose";
import Product from "../models/products.js";
import Order from "../models/order.js";
import User from "../models/userModel.js";
// POST /order
// const addOrders = async (req, res) => {
//   const { items, totalAmount } = req.body;

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: "No items in the order." });
//   }

//   try {
//     const newOrder = new Order({
//       userId: req.user._id,
//       items,
//       totalAmount,
//     });

//     await newOrder.save();

//     return res.status(201).json({
//       message: "Order placed successfully",
//       order: newOrder,
//     });
//   } catch (error) {
  //     console.error("Error placing order:", error);
  //     return res.status(500).json({ message: "Internal Server Error" });
  //   }
  // };
  

// POST /order
const addOrders = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  try {
    // Validate and update stock
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

    const newOrder = new Order({
      userId: req.user._id,
      items,
      totalAmount,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
      userId:orders.map(order => order.userId._id),
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

export {
  addOrders,
  getOrders,
  getOrderById,
  getOrdersAdmin,
  updateOrderStatus,
};
