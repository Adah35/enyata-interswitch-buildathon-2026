"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const payment_logic_1 = require("../logic/payment.logic");
class PaymentController {
    constructor() {
        /** POST /api/v1/payments/tasks/:taskId/initiate */
        this.initiate = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, payment_logic_1.initiatePaymentLogic)(req.user.id, req.params.taskId);
            res.json({ success: true, data });
        });
        /** GET /api/v1/payments/tasks/:taskId/status */
        this.status = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, payment_logic_1.queryPaymentStatusLogic)(req.user.id, req.params.taskId);
            res.json({ success: true, data });
        });
        /** POST /api/v1/payments/tasks/:taskId/refund — ADMIN */
        this.refund = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, payment_logic_1.refundPaymentLogic)(req.params.taskId, req.body.reason);
            res.json({ success: true, data });
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map