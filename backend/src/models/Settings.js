const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'RestaurantOS' },
  gstNumber: { type: String, default: 'GSTIN123456789' },
  email: { type: String, default: 'contact@restaurant.com' },
  phone: { type: String, default: '+1 (555) 000-1234' },
  address: { type: String, default: '123 Culinary Ave, Flavor City' },
  currency: { type: String, default: '$' },
  defaultTaxRate: { type: Number, default: 5 },
  billFooterMessage: { type: String, default: 'Thank you for dining with us!' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
