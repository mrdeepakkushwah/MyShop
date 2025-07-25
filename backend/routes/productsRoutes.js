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
// router.post("/products/add",addProduct);
// router.get("/products/getProductById/:id", getProductById);
// router.get("/products", getAllProducts);
// router.put("/products/:id", authenticate, updateProductById);
// router.delete("/products/:id", authenticate, deleteProductById);
// router.put("/products/:id/update-stock", authenticate, updateStock);
router.post("/products/add", authenticate, authorizeRoles("admin"), addProduct);

router.get("/products", getAllProducts); // Add query support in controller

router.put(
  "/products/:id",
  authenticate,
  authorizeRoles("admin"),
  updateProductById
);
router.delete(
  "/products/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteProductById
);
router.put(
  "/products/:id/update-stock",
  authenticate,
  updateStock
);


export default router;