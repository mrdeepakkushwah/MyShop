// routes/order.js
const { Router }  = require("express");
const {
  addOrders,
  getOrders,
  getOrderById,
  getOrdersAdmin,
  updateOrderStatus,
} =  require("../controllers/ordersController.js");

const router = Router();
const { authenticate, authorizeRoles }  = require("../middlewares/authMiddleware.js");

router.post("/orders/place", authenticate, addOrders);
router.get("/getOrders", authenticate, getOrders);
router.get("/getOrderById/:id", authenticate, getOrderById);
router.get(
  "/getOrderAdmin",
  authenticate,
  authorizeRoles("admin"),
  getOrdersAdmin
);
router.put(
  "/orders/:orderId/status",
  authenticate,
  authorizeRoles("admin"),
  updateOrderStatus
);

module.exports = router;
