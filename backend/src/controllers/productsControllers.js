const Order = require("../models/order");
const User = require("../models/userModel");
const Product = require("../models/products");
const mongoose = require('mongoose')
// POST /product/add
const addProduct = async (req, res) => {
  try {
    const { name, price, mrp, discount, stock, image, category, description } =
      req.body;

    // Basic validation
    if (
      !name ||
      !price ||
      !mrp ||
      discount === undefined ||
      stock === undefined ||
      !image ||
      !category ||
      !description
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const product = new Product({
      name,
      price,
      mrp,
      discount,
      stock,
      image,
      category,
      description,
    });

    const savedProduct = await product.save();

    return res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Server error while adding product" });
  }
};

// get /Product

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      res.status(404).json({ message: "Products Not Found" });
    }
    res.status(201).json({ message: "Product get Successfully", products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// PUT /product/:id

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ error: "Server error while updating product" });
  }
};

const updateStock = async (req, res) => {
  const { id } = req.params;
  const { qtyChange } = req.body; // qtyChange can be positive or negative

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newStock = product.stock - qtyChange;

    if (newStock < 0) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    product.stock = newStock;
    await product.save();

    res.status(200).json({ message: "Stock updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /product/:id
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ error: "Server error while deleting product" });
  }
};

// Add Orders
// const addOrders = async (req, res) => {
//   const { items, totalAmount } = req.body;

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: "No items in the order." });
//   }

//   try {

//     // console.log("user data ",req.user)
//     const newOrder = new Order({
//       user: req.user,
//       items,
//       totalAmount,
//     });
//     await newOrder.save();
//     return res
//       .status(201)
//       .json({ message: "Order placed successfully", order: newOrder });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     return res.status(500).json({ message: " Internal Server error" });
//   }
// };
const addOrders = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  try {
    const newOrder = new Order({
      userId: req.user._id, // Only the ID, not the whole user object
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

// Get Orders
// const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()

//     return res.json({ message: "Order Get Successfully", orders });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
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

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // recent orders first
      .populate("userId", "name email city pincode"); // Optional: include user info

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("UPDATE ORDER:", orderId, status);

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID" });
    }

    // Validate status value
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update status and save
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

module.exports = {
  addProduct,
  updateStock,
  deleteProductById,
  updateProductById,
  getAllProducts,
  addOrders,
  getOrders,
  getOrderById,
  getOrdersAdmin,
  updateOrderStatus,
  getProductById,
};
