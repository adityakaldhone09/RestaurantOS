const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
