// routes/order.js
const express = require("express");
const { getOrders, addOrders,getOrderById } = require("../controllers/productsControllers");
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');

router.post('/addOrders',authenticate,addOrders);
router.get('/getOrders',authenticate,getOrders);
router.get("/getOrderById/:id", authenticate, getOrderById);

module.exports = router;
