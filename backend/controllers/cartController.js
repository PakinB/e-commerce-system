import Cart from '../models/Cart.js';

export async function getCart(req, res) {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  return res.json({ items: cart?.items || [] });
}

export async function addToCart(req, res) {
  const { productId, quantity = 1, replace = false } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity = replace ? quantity : existingItem.quantity + quantity;
    if (existingItem.quantity < 1) existingItem.quantity = 1;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.productId');
  return res.json({ items: populated.items });
}

export async function removeFromCart(req, res) {
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) return res.json({ items: [] });

  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate('items.productId');
  return res.json({ items: populated.items });
}
