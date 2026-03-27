"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bid_logic_1 = require("../logic/bid.logic");
class BidController {
    constructor() {
        /** POST /api/v1/bids/tasks/:taskId/bids */
        this.submit = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, bid_logic_1.submitBidLogic)(req.user.id, req.params.taskId, req.body);
            res.status(201).json({ success: true, data });
        });
        /** GET /api/v1/bids/tasks/:taskId/bids */
        this.list = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, bid_logic_1.listBidsLogic)(req.user.id, req.params.taskId);
            res.json({ success: true, data });
        });
        /** PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/accept */
        this.accept = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, bid_logic_1.acceptBidLogic)(req.user.id, req.params.taskId, req.params.bidId);
            res.json({ success: true, data, message: 'Bid accepted. Proceed to payment to confirm assignment.' });
        });
        /** PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/reject */
        this.reject = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, bid_logic_1.rejectBidLogic)(req.user.id, req.params.taskId, req.params.bidId);
            res.json({ success: true, data });
        });
        /** DELETE /api/v1/bids/tasks/:taskId/bids/:bidId */
        this.withdraw = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, bid_logic_1.withdrawBidLogic)(req.user.id, req.params.taskId, req.params.bidId);
            res.json({ success: true, data, message: 'Bid withdrawn' });
        });
    }
}
exports.BidController = BidController;
//# sourceMappingURL=bid.controller.js.map