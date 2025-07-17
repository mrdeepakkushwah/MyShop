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

const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// Secure routes
router.post("/products/add",authenticate, addProduct);
router.get("/products/getProductById/:id",getProductById);
router.get("/products",getAllProducts)
router.put("/products/:id",authenticate, updateProductById);
router.delete("/products/:id",authenticate, deleteProductById);
router.put("/products/:id/update-stock",authenticate, updateStock);

module.exports = router;
