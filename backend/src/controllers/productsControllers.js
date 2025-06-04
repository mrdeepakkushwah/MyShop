const Order = require("../models/order");
const Product = require("../models/products");

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
const addOrders = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order." });
  }

  try {

    // console.log("user data ",req.user)
    const newOrder = new Order({
      userId: req.user._id,
      items,
      totalAmount,
    });
    await newOrder.save();
    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: " Internal Server error" });
  }
};
// Get Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ message: "Order Get Successfully", orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ message: "Server error" });
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
 
     return res.status(200).json({order});
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};
module.exports = {
  addProduct,
  deleteProductById,
  updateProductById,
  getAllProducts,
  addOrders,getOrders
  ,getOrderById
};
