"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentSchema = void 0;
const zod_1 = require("zod");
exports.refundPaymentSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5).max(500),
});
//# sourceMappingURL=payment.schema.js.map