"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bid_controller_1 = require("../controller/bid.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const bid_schema_1 = require("../validation/bid.schema");
const enums_1 = require("../entities/enums");
const router = (0, express_1.Router)();
const ctrl = new bid_controller_1.BidController();
router.use(authMiddleware_1.authMiddleware);
// POST /api/v1/bids/tasks/:taskId/bids — TASKER / BOTH
router.post('/tasks/:taskId/bids', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), (0, validate_1.validate)(bid_schema_1.submitBidSchema), ctrl.submit);
// GET /api/v1/bids/tasks/:taskId/bids — POSTER / BOTH (only poster sees all bids)
router.get('/tasks/:taskId/bids', ctrl.list);
// PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/accept — POSTER / BOTH
router.patch('/tasks/:taskId/bids/:bidId/accept', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.accept);
// PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/reject — POSTER / BOTH
router.patch('/tasks/:taskId/bids/:bidId/reject', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.reject);
// DELETE /api/v1/bids/tasks/:taskId/bids/:bidId — TASKER / BOTH
router.delete('/tasks/:taskId/bids/:bidId', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), ctrl.withdraw);
exports.default = router;
//# sourceMappingURL=bid.route.js.map