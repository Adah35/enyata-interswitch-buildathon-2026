"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRoute = void 0;
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const user_route_1 = __importDefault(require("./user.route"));
const task_route_1 = __importDefault(require("./task.route"));
const bid_route_1 = __importDefault(require("./bid.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
const webhook_route_1 = __importDefault(require("./webhook.route"));
exports.rootRoute = (0, express_1.Router)();
exports.rootRoute.use('/auth', auth_route_1.default);
exports.rootRoute.use('/users', user_route_1.default);
exports.rootRoute.use('/tasks', task_route_1.default);
exports.rootRoute.use('/bids', bid_route_1.default);
exports.rootRoute.use('/payments', payment_route_1.default);
exports.rootRoute.use('/webhooks', webhook_route_1.default);
//# sourceMappingURL=index.js.map