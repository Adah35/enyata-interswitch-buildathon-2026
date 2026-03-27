"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpLogic = exports.sendOtpLogic = exports.updateUserAccountLogic = exports.getUserAccountLogic = exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerNewUser = void 0;
const config_1 = require("../config");
const errors_1 = require("../errors/errors");
const userService_1 = require("../services/userService");
const redis_1 = __importDefault(require("../utils/redis"));
const userService = new userService_1.UserService();
const OTP_RATE_LIMIT_PREFIX = 'otp_rate:';
const OTP_MAX_ATTEMPTS = 3;
const OTP_WINDOW_SECONDS = 10 * 60; // 10 minutes
// Lazy-load twilio to avoid crash when credentials are not set
function getTwilioVerify() {
    const twilio = require('twilio');
    const client = twilio(config_1.config.TWILIO_ACCOUNT_SID, config_1.config.TWILIO_AUTH_TOKEN);
    return client.verify.v2.services(config_1.config.TWILIO_VERIFY_SERVICE_SID);
}
/**
 * Register new user
 */
const registerNewUser = async (data) => {
    return userService.registerUser(data);
};
exports.registerNewUser = registerNewUser;
/**
 * Login user
 */
const loginUser = async (data) => {
    return userService.loginUser(data.email, data.password);
};
exports.loginUser = loginUser;
/**
 * Refresh access token using refresh token stored in DB
 */
const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new errors_1.BadRequestException('No refresh token provided');
    }
    return userService.refreshAccessToken(refreshToken);
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * Logout — invalidates the refresh token in DB
 */
const logoutUser = async (refreshToken) => {
    await userService.logout(refreshToken);
    return { message: 'Logged out successfully' };
};
exports.logoutUser = logoutUser;
/**
 * Get authenticated user's profile
 */
const getUserAccountLogic = async (userId) => {
    const user = await userService.getUser(userId);
    return userService.toDTO(user);
};
exports.getUserAccountLogic = getUserAccountLogic;
/**
 * Update authenticated user's profile
 */
const updateUserAccountLogic = async (userId, data) => {
    return userService.updateUser(userId, data);
};
exports.updateUserAccountLogic = updateUserAccountLogic;
/**
 * Send SMS OTP via Twilio Verify
 * Rate limit: max 3 requests per phone per 10 minutes
 */
const sendOtpLogic = async (phone) => {
    const key = `${OTP_RATE_LIMIT_PREFIX}${phone}`;
    let attempts = 0;
    try {
        const val = await redis_1.default.get(key);
        attempts = val ? parseInt(val, 10) : 0;
    }
    catch {
        console.warn('Redis unavailable for OTP rate limit check');
    }
    if (attempts >= OTP_MAX_ATTEMPTS) {
        throw new errors_1.BadRequestException('Too many OTP requests. Please wait 10 minutes before trying again.');
    }
    try {
        const verifyService = getTwilioVerify();
        await verifyService.verifications.create({ to: phone, channel: 'sms' });
    }
    catch (err) {
        throw new errors_1.BadRequestException(`Failed to send OTP: ${err.message}`);
    }
    try {
        await redis_1.default.set(key, String(attempts + 1), { EX: OTP_WINDOW_SECONDS });
    }
    catch {
        console.warn('Redis unavailable — OTP rate limit not persisted');
    }
    return { message: 'OTP sent' };
};
exports.sendOtpLogic = sendOtpLogic;
/**
 * Verify SMS OTP via Twilio Verify, then mark phone as verified
 */
const verifyOtpLogic = async (userId, phone, code) => {
    try {
        const verifyService = getTwilioVerify();
        const check = await verifyService.verificationChecks.create({ to: phone, code });
        if (check.status !== 'approved') {
            throw new errors_1.UnauthorizedError('Invalid or expired OTP');
        }
    }
    catch (err) {
        if (err instanceof errors_1.UnauthorizedError)
            throw err;
        throw new errors_1.BadRequestException(`OTP verification failed: ${err.message}`);
    }
    await userService.markPhoneVerified(userId);
    try {
        await redis_1.default.del(`${OTP_RATE_LIMIT_PREFIX}${phone}`);
    }
    catch {
        // ignore
    }
    return { message: 'Phone verified' };
};
exports.verifyOtpLogic = verifyOtpLogic;
//# sourceMappingURL=auth.logic.js.map