import { Router } from 'express';
import { BidController } from '../controller/bid.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { submitBidSchema } from '../validation/bid.schema';
import { UserRole } from '../entities/enums';

const router = Router();
const ctrl = new BidController();

router.use(authMiddleware);

// POST /api/v1/bids/tasks/:taskId/bids — TASKER / BOTH
router.post(
  '/tasks/:taskId/bids',
  authorize(UserRole.TASKER, UserRole.BOTH),
  validate(submitBidSchema),
  ctrl.submit,
);

// GET /api/v1/bids/tasks/:taskId/bids — POSTER / BOTH (only poster sees all bids)
router.get('/tasks/:taskId/bids', ctrl.list);

// PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/accept — POSTER / BOTH
router.patch(
  '/tasks/:taskId/bids/:bidId/accept',
  authorize(UserRole.POSTER, UserRole.BOTH),
  ctrl.accept,
);

// PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/reject — POSTER / BOTH
router.patch(
  '/tasks/:taskId/bids/:bidId/reject',
  authorize(UserRole.POSTER, UserRole.BOTH),
  ctrl.reject,
);

// DELETE /api/v1/bids/tasks/:taskId/bids/:bidId — TASKER / BOTH
router.delete(
  '/tasks/:taskId/bids/:bidId',
  authorize(UserRole.TASKER, UserRole.BOTH),
  ctrl.withdraw,
);

export default router;
