const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router.get('/categories', getCategories);
router.post('/categories', protect, authorize('Admin', 'Manager'), createCategory);

router.get('/items', getItems);
router.get('/items/:id', getItemById);
router.post('/items', protect, authorize('Admin', 'Manager'), createItem);
router.put('/items/:id', protect, authorize('Admin', 'Manager'), updateItem);
router.delete('/items/:id', protect, authorize('Admin', 'Manager'), deleteItem);

module.exports = router;
