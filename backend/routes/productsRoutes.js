import { Router } from "express";
const router = Router();
import {
  addProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
  updateStock,
  getProductById,
} from "../controllers/productsControllers.js";

import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

// Secure routes
router.post("/products/add",addProduct);
router.get("/products/getProductById/:id", getProductById);
router.get("/products", getAllProducts);
router.put("/products/:id", authenticate, updateProductById);
router.delete("/products/:id", authenticate, deleteProductById);
router.put("/products/:id/update-stock", authenticate, updateStock);

export default router;