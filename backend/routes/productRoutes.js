import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProductById));
router.post('/', protect, adminOnly, upload.single('image'), asyncHandler(createProduct));
router.put('/:id', protect, adminOnly, upload.single('image'), asyncHandler(updateProduct));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

export default router;
