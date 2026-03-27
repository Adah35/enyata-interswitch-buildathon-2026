import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  updateProfileSchema,
  saveBankAccountSchema,
  verifyBankQuerySchema,
  notificationsQuerySchema,
  completeKycSchema,
} from '../validation/user.schema';

import { UserRole } from '../entities/enums';

const router = Router();
const ctrl = new UserController();

// All user routes require authentication
router.use(authMiddleware);

// ─── /me routes must come before /:id ────────────────────────────────────────

// GET /api/v1/users/me
router.get('/me', ctrl.getMe);

// PATCH /api/v1/users/me
router.patch('/me', validate(updateProfileSchema), ctrl.updateMe);

// POST /api/v1/users/me/bank-account — TASKER or BOTH roles
router.post(
  '/me/bank-account',
  authorize(UserRole.TASKER, UserRole.BOTH),
  validate(saveBankAccountSchema),
  ctrl.saveBankAccount,
);


// POST /api/v1/users/me/kyc
router.post('/me/kyc', validate(completeKycSchema), ctrl.kycComplete);
// GET /api/v1/users/me/bank-account/verify — TASKER or BOTH roles
router.get(
  '/me/bank-account/verify',
  authorize(UserRole.TASKER, UserRole.BOTH),
  validate(verifyBankQuerySchema, 'query'),
  ctrl.verifyBankAccount,
);

// GET /api/v1/users/me/notifications
router.get('/me/notifications', validate(notificationsQuerySchema, 'query'), ctrl.getNotifications);

// PATCH /api/v1/users/me/notifications/:id/read
router.patch('/me/notifications/:id/read', ctrl.markNotificationRead);

// ─── Public profile — must come LAST to avoid /me being caught as :id ─────────

// GET /api/v1/users/:id
router.get('/:id', ctrl.getPublicProfile);

export default router;
