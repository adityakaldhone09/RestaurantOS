const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  currentQuantity: { type: Number, required: true, default: 0 },
  minimumStockLevel: { type: Number, required: true, default: 5 },
  unit: { type: String, default: 'kg' },
  costPerUnit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
