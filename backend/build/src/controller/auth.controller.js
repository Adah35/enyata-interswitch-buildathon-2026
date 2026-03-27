"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_logic_1 = require("../logic/auth.logic");
const REFRESH_COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};
const ACCESS_COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
};
class AuthController {
    constructor() {
        /**
         * POST /api/v1/auth/register
         */
        this.register = (0, express_async_handler_1.default)(async (req, res) => {
            const { user, accessToken, refreshToken } = await (0, auth_logic_1.registerNewUser)(req.body);
            res
                .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
                .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
                .status(201)
                .json({
                success: true,
                message: 'Registration successful',
                data: { user, accessToken, refreshToken },
            });
        });
        /**
         * POST /api/v1/auth/login
         */
        this.login = (0, express_async_handler_1.default)(async (req, res) => {
            const { user, accessToken, refreshToken } = await (0, auth_logic_1.loginUser)(req.body);
            res
                .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
                .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
                .json({
                success: true,
                message: 'Login successful',
                data: { user, accessToken, refreshToken },
            });
        });
        /**
         * POST /api/v1/auth/refresh
         */
        this.refresh = (0, express_async_handler_1.default)(async (req, res) => {
            const token = req.cookies?.refreshToken || req.body?.refreshToken;
            const { accessToken, refreshToken } = await (0, auth_logic_1.refreshAccessToken)(token);
            res
                .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
                .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
                .json({
                success: true,
                data: { accessToken, refreshToken },
            });
        });
        /**
         * POST /api/v1/auth/logout
         */
        this.logout = (0, express_async_handler_1.default)(async (req, res) => {
            const token = req.cookies?.refreshToken || req.body?.refreshToken;
            await (0, auth_logic_1.logoutUser)(token);
            res
                .clearCookie('accessToken')
                .clearCookie('refreshToken')
                .json({ success: true, message: 'Logged out successfully' });
        });
        /**
         * POST /api/v1/auth/send-otp
         */
        this.sendOtp = (0, express_async_handler_1.default)(async (req, res) => {
            const { phone } = req.body;
            const result = await (0, auth_logic_1.sendOtpLogic)(phone);
            res.json({ success: true, data: result });
        });
        /**
         * POST /api/v1/auth/verify-otp
         * Requires authentication — user must be logged in to verify their phone
         */
        this.verifyOtp = (0, express_async_handler_1.default)(async (req, res) => {
            const { phone, code } = req.body;
            const result = await (0, auth_logic_1.verifyOtpLogic)(req.user.id, phone, code);
            res.json({ success: true, data: result });
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map