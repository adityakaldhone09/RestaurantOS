const express = require('express');
const router = express.Router();
const {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTables);
router.get('/:id', getTableById);
router.post('/', protect, authorize('Admin', 'Manager'), createTable);
router.put('/:id', protect, updateTable);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteTable);

module.exports = router;
