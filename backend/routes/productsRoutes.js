const { Router } = require("express");
const router = Router();
const {
  addProduct,
  updateProductById,
  deleteProductById,
  getAllProducts,
  updateStock,
  getProductById,
}  = require("../controllers/productsControllers.js");

const { authenticate, authorizeRoles }  = require("../middlewares/authMiddleware.js");

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


module.exports =  router;