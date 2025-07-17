// routes/order.js
const express = require("express");
const { getOrders, addOrders,getOrderById, getOrdersAdmin, updateOrderStatus } = require("../controllers/productsControllers");
const router = express.Router();
const {authenticate,authorizeRoles} = require('../middlewares/authMiddleware');

router.post('/addOrders',authenticate,authorizeRoles('admin'),addOrders);
router.get('/getOrders',authenticate,authorizeRoles('admin'),getOrders);
router.get("/getOrderById/:id", authenticate, getOrderById);
router.get('/getOrderAdmin',authenticate,authorizeRoles('admin'),getOrdersAdmin);
router.put("/orders/:orderId/status",
  authenticate,
  authorizeRoles('admin'),
  updateOrderStatus
);

module.exports = router;
