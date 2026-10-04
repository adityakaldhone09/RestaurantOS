const Order = require('../models/Order');
const Table = require('../models/Table');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('table', 'tableNumber capacity location status')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table')
      .populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { table, items, subtotal, tax, total } = req.body;

    const count = await Order.countDocuments();
    const orderId = `ORD-${String(count + 1).padStart(4, '0')}`;

    const order = await Order.create({
      orderId,
      table,
      items,
      subtotal,
      tax,
      total,
      status: 'Confirmed'
    });

    if (table) {
      await Table.findByIdAndUpdate(table, { status: 'Occupied' });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('table')
      .populate('items.menuItem');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    Object.assign(order, req.body);
    await order.save();

    if (['Completed', 'Cancelled'].includes(order.status) && order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'Available' });
    }

    const updated = await Order.findById(order._id)
      .populate('table')
      .populate('items.menuItem');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    if (['Completed', 'Cancelled'].includes(status) && order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'Available' });
    }

    const updated = await Order.findById(order._id)
      .populate('table')
      .populate('items.menuItem');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
