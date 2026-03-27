"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const user_schema_1 = require("../validation/user.schema");
const enums_1 = require("../entities/enums");
const router = (0, express_1.Router)();
const ctrl = new user_controller_1.UserController();
// All user routes require authentication
router.use(authMiddleware_1.authMiddleware);
// ─── /me routes must come before /:id ────────────────────────────────────────
// GET /api/v1/users/me
router.get('/me', ctrl.getMe);
// PATCH /api/v1/users/me
router.patch('/me', (0, validate_1.validate)(user_schema_1.updateProfileSchema), ctrl.updateMe);
// POST /api/v1/users/me/bank-account — TASKER or BOTH roles
router.post('/me/bank-account', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), (0, validate_1.validate)(user_schema_1.saveBankAccountSchema), ctrl.saveBankAccount);
// POST /api/v1/users/me/kyc
router.post('/me/kyc', (0, validate_1.validate)(user_schema_1.completeKycSchema), ctrl.kycComplete);
// GET /api/v1/users/me/bank-account/verify — TASKER or BOTH roles
router.get('/me/bank-account/verify', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), (0, validate_1.validate)(user_schema_1.verifyBankQuerySchema, 'query'), ctrl.verifyBankAccount);
// GET /api/v1/users/me/notifications
router.get('/me/notifications', (0, validate_1.validate)(user_schema_1.notificationsQuerySchema, 'query'), ctrl.getNotifications);
// PATCH /api/v1/users/me/notifications/:id/read
router.patch('/me/notifications/:id/read', ctrl.markNotificationRead);
// ─── Public profile — must come LAST to avoid /me being caught as :id ─────────
// GET /api/v1/users/:id
router.get('/:id', ctrl.getPublicProfile);
exports.default = router;
//# sourceMappingURL=user.route.js.map