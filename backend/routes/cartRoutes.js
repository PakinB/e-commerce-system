import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, asyncHandler(getCart));
router.post('/add', protect, asyncHandler(addToCart));
router.delete('/remove', protect, asyncHandler(removeFromCart));

export default router;
