import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function register(req, res) {
  const { name, email, password, address } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({ name, email: normalizedEmail, password, address });
  const token = generateToken(user._id);

  return res.status(201).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    },
  });
}

export async function me(req, res) {
  return res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      address: req.user.address,
    },
  });
}
