// routes/order.js
import { Router } from "express";
import {
  addOrders,
  getOrders,
  getOrderById,
  getOrdersAdmin,
  updateOrderStatus,
} from "../controllers/ordersController.js";

const router = Router();
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

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

export default router;
