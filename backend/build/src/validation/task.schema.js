"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMediaSchema = exports.completeTaskSchema = exports.nearbyTasksQuerySchema = exports.listTasksQuerySchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../entities/enums");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200),
    description: zod_1.z.string().min(10).max(2000),
    categoryId: zod_1.z.string().uuid().optional(),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    locationDisplay: zod_1.z.string().min(3).max(200),
    locationExact: zod_1.z.string().min(3).max(500),
    budgetKobo: zod_1.z.number().int().positive(),
    scheduledFor: zod_1.z.string().datetime().optional(),
    durationEstimate: zod_1.z.string().max(100).optional(),
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(200).optional(),
    description: zod_1.z.string().min(10).max(2000).optional(),
    categoryId: zod_1.z.string().uuid().nullable().optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    locationDisplay: zod_1.z.string().min(3).max(200).optional(),
    locationExact: zod_1.z.string().min(3).max(500).optional(),
    budgetKobo: zod_1.z.number().int().positive().optional(),
    scheduledFor: zod_1.z.string().datetime().nullable().optional(),
    durationEstimate: zod_1.z.string().max(100).nullable().optional(),
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
exports.listTasksQuerySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.TaskStatus).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    lat: zod_1.z.coerce.number().optional(),
    lng: zod_1.z.coerce.number().optional(),
    radiusKm: zod_1.z.coerce.number().positive().default(10),
    minBudget: zod_1.z.coerce.number().int().positive().optional(),
    maxBudget: zod_1.z.coerce.number().int().positive().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(50).default(20),
});
exports.nearbyTasksQuerySchema = zod_1.z.object({
    lat: zod_1.z.coerce.number(),
    lng: zod_1.z.coerce.number(),
    radiusKm: zod_1.z.coerce.number().positive().default(10),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(50).default(20),
});
exports.completeTaskSchema = zod_1.z.object({
    completionProofUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.addMediaSchema = zod_1.z.object({
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).min(1).max(5),
});
//# sourceMappingURL=task.schema.js.map