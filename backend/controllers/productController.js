import Product from '../models/Product.js';

export async function getProducts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };

  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  const [products, total, categories] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(query),
    Product.distinct('category'),
  ]);

  res.json({
    products,
    categories,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json({ product });
}

export async function createProduct(req, res) {
  const images = req.file ? [`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`] : [];

  const product = await Product.create({
    ...req.body,
    sizes: req.body.sizes?.split(',').map((s) => s.trim()) || [],
    images,
  });

  return res.status(201).json({ product });
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const updates = { ...req.body };
  if (req.body.sizes) updates.sizes = req.body.sizes.split(',').map((s) => s.trim());
  if (req.file) {
    updates.images = [`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`];
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  return res.json({ product: updated });
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json({ message: 'Product deleted' });
}
