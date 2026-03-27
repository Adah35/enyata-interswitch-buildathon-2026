"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const auth_schema_1 = require("../validation/auth.schema");
const router = (0, express_1.Router)();
const ctrl = new auth_controller_1.AuthController();
// POST /api/v1/auth/register
router.post('/register', (0, validate_1.validate)(auth_schema_1.registerSchema), ctrl.register);
// POST /api/v1/auth/login
router.post('/login', (0, validate_1.validate)(auth_schema_1.loginSchema), ctrl.login);
// POST /api/v1/auth/refresh  — accepts token in body or cookie
router.post('/refresh', ctrl.refresh);
// POST /api/v1/auth/logout  — protected so we can identify which refresh token to revoke
router.post('/logout', authMiddleware_1.authMiddleware, ctrl.logout);
// POST /api/v1/auth/send-otp
router.post('/send-otp', (0, validate_1.validate)(auth_schema_1.sendOtpSchema), ctrl.sendOtp);
// POST /api/v1/auth/verify-otp  — user must be logged in
router.post('/verify-otp', authMiddleware_1.authMiddleware, (0, validate_1.validate)(auth_schema_1.verifyOtpSchema), ctrl.verifyOtp);
exports.default = router;
//# sourceMappingURL=auth.route.js.map