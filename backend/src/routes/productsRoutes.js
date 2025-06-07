const express = require("express");
const router = express.Router();
const {
  addProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
  updateStock,
  getProductById,
} = require('../controllers/productsControllers');

const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');

// Secure routes
router.post("/products/add", addProduct);
router.get("/products/getProductById/:id",getProductById);
router.get("/products",getAllProducts)
router.put("/products/:id", updateProductById);
router.delete("/products/:id", deleteProductById);
router.put("/products/:id/update-stock", updateStock);

module.exports = router;
