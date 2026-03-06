import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.post('/', protect, asyncHandler(createOrder));
router.get('/', protect, asyncHandler(getOrders));
router.get('/:id', protect, asyncHandler(getOrderById));
router.put('/:id/status', protect, adminOnly, asyncHandler(updateOrderStatus));

export default router;
