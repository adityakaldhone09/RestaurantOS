const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  price: { type: Number, required: true },
  image: { type: String },
  isVegetarian: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number },
  taxRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
