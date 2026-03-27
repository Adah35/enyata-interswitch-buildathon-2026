"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsQuerySchema = exports.verifyBankQuerySchema = exports.saveBankAccountSchema = exports.updateProfileSchema = exports.completeKycSchema = void 0;
const zod_1 = require("zod");
exports.completeKycSchema = zod_1.z.object({
    nin: zod_1.z.string().length(11, 'NIN must be 11 digits'),
    bvn: zod_1.z.string().length(11, 'BVN must be 11 digits'),
    passportUrl: zod_1.z.string().url('Passport must be a valid URL'),
});
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(100).optional(),
    bio: zod_1.z.string().max(500).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
});
exports.saveBankAccountSchema = zod_1.z.object({
    bankCode: zod_1.z.string().min(3).max(10),
    accountNumber: zod_1.z.string().length(10),
    accountName: zod_1.z.string().min(2).max(100), // confirmed from ISW name lookup shown to user
});
exports.verifyBankQuerySchema = zod_1.z.object({
    accountNumber: zod_1.z.string().length(10),
    bankCode: zod_1.z.string().min(3).max(10),
});
exports.notificationsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(50).default(20),
    unreadOnly: zod_1.z
        .string()
        .optional()
        .transform((v) => v === 'true'),
});
//# sourceMappingURL=user.schema.js.map