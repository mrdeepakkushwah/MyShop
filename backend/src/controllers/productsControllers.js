const Product = require('../models/products');

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

const  getAllProducts =  async (req, res) => {
  try {
    
    const products = await Product.find();
    if(!products){
      res.status(404).json({message:"Products Not Found"})
    }
    res.status(201).json({message:"Product get Successfully",products});
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
module.exports = { addProduct,deleteProductById,updateProductById,getAllProducts };
