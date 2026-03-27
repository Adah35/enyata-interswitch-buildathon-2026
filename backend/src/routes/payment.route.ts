import { Router } from 'express';
import { PaymentController } from '../controller/payment.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { refundPaymentSchema } from '../validation/payment.schema';
import { UserRole } from '../entities/enums';

const router = Router();
const ctrl = new PaymentController();

router.use(authMiddleware);

// POST /api/v1/payments/tasks/:taskId/initiate — POSTER / BOTH
router.post(
  '/tasks/:taskId/initiate',
  authorize(UserRole.POSTER, UserRole.BOTH),
  ctrl.initiate,
);

// GET /api/v1/payments/tasks/:taskId/status — POSTER / BOTH
router.get(
  '/tasks/:taskId/status',
  authorize(UserRole.POSTER, UserRole.BOTH),
  ctrl.status,
);

// POST /api/v1/payments/tasks/:taskId/refund — ADMIN only
router.post(
  '/tasks/:taskId/refund',
  authorize(UserRole.ADMIN),
  validate(refundPaymentSchema),
  ctrl.refund,
);

export default router;
