"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_logic_1 = require("../logic/user.logic");
class UserController {
    constructor() {
        /** POST /api/v1/users/me/kyc */
        this.kycComplete = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.completeKyc)(req.user.id, req.body);
            res.json({ success: true, data, message: 'KYC completed successfully' });
        });
        /** GET /api/v1/users/me */
        this.getMe = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.getMyProfileLogic)(req.user.id);
            res.json({ success: true, data });
        });
        /** PATCH /api/v1/users/me */
        this.updateMe = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.updateMyProfileLogic)(req.user.id, req.body);
            res.json({ success: true, data });
        });
        /** POST /api/v1/users/me/bank-account */
        this.saveBankAccount = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.saveBankAccountLogic)(req.user.id, req.body);
            res.json({ success: true, data, message: 'Bank account linked successfully' });
        });
        /** GET /api/v1/users/me/bank-account/verify?accountNumber=&bankCode= */
        this.verifyBankAccount = (0, express_async_handler_1.default)(async (req, res) => {
            const { accountNumber, bankCode } = req.query;
            const data = await (0, user_logic_1.verifyBankAccountLogic)(accountNumber, bankCode);
            res.json({ success: true, data });
        });
        /** GET /api/v1/users/:id — public profile */
        this.getPublicProfile = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.getPublicProfileLogic)(req.params.id);
            res.json({ success: true, data });
        });
        /** GET /api/v1/users/me/notifications */
        this.getNotifications = (0, express_async_handler_1.default)(async (req, res) => {
            const { page, limit, unreadOnly } = req.query;
            const result = await (0, user_logic_1.getNotificationsLogic)(req.user.id, Number(page) || 1, Number(limit) || 20, unreadOnly === 'true');
            res.json({ success: true, ...result });
        });
        /** PATCH /api/v1/users/me/notifications/:id/read */
        this.markNotificationRead = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, user_logic_1.markNotificationReadLogic)(req.user.id, req.params.id);
            res.json({ success: true, data });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map