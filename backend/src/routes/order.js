// routes/order.js
const express = require("express");
const { getOrders, addOrders,getOrderById, getOrdersAdmin, updateOrderStatus } = require("../controllers/productsControllers");
const router = express.Router();
const {authenticate,adminOnly} = require('../middlewares/authMiddleware');

router.post('/addOrders',authenticate,adminOnly,addOrders);
router.get('/getOrders',authenticate,getOrders);
router.get("/getOrderById/:id", authenticate, getOrderById);
router.get('/getOrderAdmin',authenticate,adminOnly,getOrdersAdmin);
router.put("/orders/:orderId/status",
  authenticate,
  adminOnly,
  updateOrderStatus
);

module.exports = router;
