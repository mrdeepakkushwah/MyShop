import Product from "../models/products.js";

// POST /product/add
const addProduct = async (req, res) => {
  try {
    const { name, price, mrp, discount, stock, image, category, description } =
      req.body;

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
    console.error("Error adding product:", error.message);
    return res.status(500).json({ error: "Server error while adding product" });
  }
};

// GET /products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET /product/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: "Server error" });
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
    console.error("Error updating product:", error.message);
    return res
      .status(500)
      .json({ error: "Server error while updating product" });
  }
};

// PATCH /product/:id/stock
const updateStock = async (req, res) => {
  const { id } = req.params;
  const { qtyChange } = req.body;

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
    console.error("Error updating stock:", err.message);
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
    console.error("Error deleting product:", error.message);
    return res
      .status(500)
      .json({ error: "Server error while deleting product" });
  }
};

export {
  addProduct,
  updateStock,
  deleteProductById,
  updateProductById,
  getAllProducts,
  getProductById,
};
