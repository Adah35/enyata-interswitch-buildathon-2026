"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controller/payment.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const payment_schema_1 = require("../validation/payment.schema");
const enums_1 = require("../entities/enums");
const router = (0, express_1.Router)();
const ctrl = new payment_controller_1.PaymentController();
router.use(authMiddleware_1.authMiddleware);
// POST /api/v1/payments/tasks/:taskId/initiate — POSTER / BOTH
router.post('/tasks/:taskId/initiate', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.initiate);
// GET /api/v1/payments/tasks/:taskId/status — POSTER / BOTH
router.get('/tasks/:taskId/status', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.status);
// POST /api/v1/payments/tasks/:taskId/refund — ADMIN only
router.post('/tasks/:taskId/refund', (0, authorize_1.authorize)(enums_1.UserRole.ADMIN), (0, validate_1.validate)(payment_schema_1.refundPaymentSchema), ctrl.refund);
exports.default = router;
//# sourceMappingURL=payment.route.js.map