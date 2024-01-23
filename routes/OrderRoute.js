const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { createOrder, getOrders, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered } = require('../controllers/OrderController');
const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

module.exports = router;