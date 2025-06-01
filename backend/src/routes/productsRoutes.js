const express = require("express");
const router = express.Router();
const {
  addProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
} = require('../controllers/productsControllers');

const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// Secure routes
router.post("/products/add", addProduct);
router.get("/products",getAllProducts)
router.put("/products/:id", updateProductById);
router.delete("/products/:id", deleteProductById);

module.exports = router;
