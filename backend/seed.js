const mongoose = require('mongoose');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const MenuItem = require('./src/models/MenuItem');
const Table = require('./src/models/Table');
const Order = require('./src/models/Order');
const InventoryItem = require('./src/models/InventoryItem');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Seeding initial data...');

    // 1. Users
    const admin = await User.create({
      name: 'Aditya (Admin)',
      email: 'admin@restaurant.com',
      password: 'password123',
      role: 'Admin',
      phone: '+1 555-0101',
      status: 'Active'
    });

    const manager = await User.create({
      name: 'Sarah (Manager)',
      email: 'manager@restaurant.com',
      password: 'password123',
      role: 'Manager',
      phone: '+1 555-0102',
      status: 'Active'
    });

    const waiter = await User.create({
      name: 'John (Waiter)',
      email: 'waiter@restaurant.com',
      password: 'password123',
      role: 'Waiter',
      phone: '+1 555-0103',
      status: 'Active'
    });

    // 2. Categories
    const catAppetizers = await Category.create({ name: 'Appetizers', description: 'Starters & small plates' });
    const catMains = await Category.create({ name: 'Main Course', description: 'Hearty entrees & chef specials' });
    const catDesserts = await Category.create({ name: 'Desserts', description: 'Sweet treats' });
    const catBeverages = await Category.create({ name: 'Beverages', description: 'Refreshing drinks & coffee' });

    // 3. Menu Items
    const itemPizza = await MenuItem.create({
      name: 'Margherita Pizza',
      description: 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil',
      category: catMains._id,
      price: 16.99,
      isVegetarian: true,
      preparationTime: 15
    });

    const itemPasta = await MenuItem.create({
      name: 'Truffle Fettuccine',
      description: 'Handmade fettuccine with wild mushrooms, black truffle butter, and parmesan',
      category: catMains._id,
      price: 22.50,
      isVegetarian: true,
      preparationTime: 18
    });

    const itemSalmon = await MenuItem.create({
      name: 'Crispy Skin Salmon',
      description: 'Pan-seared Atlantic salmon with asparagus puree and lemon beurre blanc',
      category: catMains._id,
      price: 26.00,
      isVegetarian: false,
      preparationTime: 20
    });

    const itemSalad = await MenuItem.create({
      name: 'Classic Caesar Salad',
      description: 'Crisp romaine hearts, shaved parmigiano, garlic herb croutons, creamy Caesar',
      category: catAppetizers._id,
      price: 12.50,
      isVegetarian: true,
      preparationTime: 8
    });

    const itemCalamari = await MenuItem.create({
      name: 'Crispy Calamari',
      description: 'Tender calamari rings with spicy marinara and garlic aioli dip',
      category: catAppetizers._id,
      price: 14.00,
      isVegetarian: false,
      preparationTime: 10
    });

    const itemTiramisu = await MenuItem.create({
      name: 'Signature Tiramisu',
      description: 'Espresso-soaked ladyfingers, mascarpone cream, and cocoa dust',
      category: catDesserts._id,
      price: 9.50,
      isVegetarian: true,
      preparationTime: 5
    });

    const itemLemonade = await MenuItem.create({
      name: 'Mint Lemonade',
      description: 'Freshly squeezed lemons with garden mint and simple syrup',
      category: catBeverages._id,
      price: 5.50,
      isVegetarian: true,
      preparationTime: 3
    });

    // 4. Tables
    const tables = [];
    for (let i = 1; i <= 10; i++) {
      const location = i <= 4 ? 'Main Floor' : (i <= 7 ? 'Patio' : 'Window View');
      const capacity = i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2);
      const table = await Table.create({
        tableNumber: i,
        capacity,
        status: i === 2 ? 'Occupied' : (i === 4 ? 'Reserved' : 'Available'),
        location
      });
      tables.push(table);
    }

    // 5. Inventory
    await InventoryItem.create([
      { name: 'San Marzano Tomatoes', category: 'Produce', currentQuantity: 45, minimumStockLevel: 15, unit: 'kg' },
      { name: 'Fresh Mozzarella', category: 'Dairy', currentQuantity: 12, minimumStockLevel: 10, unit: 'kg' },
      { name: 'Black Truffle Oil', category: 'Pantry', currentQuantity: 4, minimumStockLevel: 5, unit: 'liters' },
      { name: 'Atlantic Salmon', category: 'Seafood', currentQuantity: 8, minimumStockLevel: 10, unit: 'kg' },
      { name: 'Espresso Beans', category: 'Beverages', currentQuantity: 25, minimumStockLevel: 8, unit: 'kg' }
    ]);

    // 6. Sample Orders
    const sampleOrder1 = await Order.create({
      orderId: 'ORD-1001',
      table: tables[1]._id,
      items: [
        { menuItem: itemPizza._id, name: itemPizza.name, price: itemPizza.price, quantity: 1, specialInstructions: 'Extra crispy crust' },
        { menuItem: itemLemonade._id, name: itemLemonade.name, price: itemLemonade.price, quantity: 2, specialInstructions: 'Less ice' }
      ],
      subtotal: 27.99,
      tax: 1.40,
      total: 29.39,
      status: 'Preparing',
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card'
    });

    const sampleOrder2 = await Order.create({
      orderId: 'ORD-1002',
      table: tables[0]._id,
      items: [
        { menuItem: itemSalmon._id, name: itemSalmon.name, price: itemSalmon.price, quantity: 1 },
        { menuItem: itemSalad._id, name: itemSalad.name, price: itemSalad.price, quantity: 1 },
        { menuItem: itemTiramisu._id, name: itemTiramisu.name, price: itemTiramisu.price, quantity: 1 }
      ],
      subtotal: 48.00,
      tax: 2.40,
      total: 50.40,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card'
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./src/config/db');
  connectDB().then(() => seedData()).then(() => process.exit(0));
}
