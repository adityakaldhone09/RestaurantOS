const express = require('express');
const router = express.Router();
const {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getInventory);
router.post('/', protect, authorize('Admin', 'Manager'), createInventoryItem);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateInventoryItem);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteInventoryItem);

module.exports = router;
