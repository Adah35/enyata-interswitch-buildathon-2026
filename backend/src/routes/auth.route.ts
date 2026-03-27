import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '../validation/auth.schema';

const router = Router();
const ctrl = new AuthController();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), ctrl.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), ctrl.login);

// POST /api/v1/auth/refresh  — accepts token in body or cookie
router.post('/refresh', ctrl.refresh);

// POST /api/v1/auth/logout  — protected so we can identify which refresh token to revoke
router.post('/logout', authMiddleware, ctrl.logout);

// POST /api/v1/auth/send-otp
router.post('/send-otp', validate(sendOtpSchema), ctrl.sendOtp);

// POST /api/v1/auth/verify-otp  — user must be logged in
router.post('/verify-otp', authMiddleware, validate(verifyOtpSchema), ctrl.verifyOtp);

export default router;
