import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

export async function createOrder(req, res) {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    price: item.productId.price,
  }));

  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const order = await Order.create({
    userId: req.user._id,
    items,
    totalPrice,
    shippingAddress,
  });

  cart.items = [];
  await cart.save();

  return res.status(201).json({ order });
}

export async function getOrders(req, res) {
  const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
  const orders = await Order.find(query)
    .populate('userId', 'name email')
    .populate('items.productId', 'name images price')
    .sort({ createdAt: -1 });

  return res.json({ orders });
}

export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('items.productId', 'name images price');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  const canView = req.user.role === 'admin' || order.userId._id.toString() === req.user._id.toString();
  if (!canView) return res.status(403).json({ message: 'Forbidden' });

  return res.json({ order });
}

export async function updateOrderStatus(req, res) {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();

  return res.json({ order });
}
