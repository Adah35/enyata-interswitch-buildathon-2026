"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitBidSchema = void 0;
const zod_1 = require("zod");
exports.submitBidSchema = zod_1.z.object({
    amountKobo: zod_1.z.number().int().positive(),
    message: zod_1.z.string().max(500).optional(),
});
//# sourceMappingURL=bid.schema.js.map