"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../entities/enums");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format e.g. +2348012345678'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.nativeEnum(enums_1.UserRole, {
        errorMap: () => ({ message: 'Role must be POSTER, TASKER, or BOTH' }),
    }).refine((r) => r !== enums_1.UserRole.ADMIN, { message: 'Cannot register as ADMIN' }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.sendOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format e.g. +2348012345678'),
});
exports.verifyOtpSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format'),
    code: zod_1.z.string().min(4, 'OTP code is required'),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().optional(),
});
//# sourceMappingURL=auth.schema.js.map