const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  specialInstructions: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['New', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'],
    default: 'New'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
