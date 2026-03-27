"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controller/task.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = require("../middleware/authorize");
const validate_1 = require("../middleware/validate");
const task_schema_1 = require("../validation/task.schema");
const enums_1 = require("../entities/enums");
const router = (0, express_1.Router)();
const ctrl = new task_controller_1.TaskController();
// All task routes require authentication
router.use(authMiddleware_1.authMiddleware);
// ─── Collection-style routes — must come before /:id ─────────────────────────
// GET /api/v1/tasks/nearby — TASKER / BOTH
router.get('/nearby', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), (0, validate_1.validate)(task_schema_1.nearbyTasksQuerySchema, 'query'), ctrl.nearby);
// GET /api/v1/tasks/my/posted
router.get('/my/posted', (0, validate_1.validate)(task_schema_1.listTasksQuerySchema, 'query'), ctrl.myPosted);
// GET /api/v1/tasks/my/assigned
router.get('/my/assigned', (0, validate_1.validate)(task_schema_1.listTasksQuerySchema, 'query'), ctrl.myAssigned);
// ─── Root collection ──────────────────────────────────────────────────────────
// POST /api/v1/tasks — POSTER / BOTH
router.post('/', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), (0, validate_1.validate)(task_schema_1.createTaskSchema), ctrl.create);
// GET /api/v1/tasks
router.get('/', (0, validate_1.validate)(task_schema_1.listTasksQuerySchema, 'query'), ctrl.list);
// ─── Task lifecycle actions — before /:id plain GET ──────────────────────────
// POST /api/v1/tasks/:id/publish — POSTER / BOTH
router.post('/:id/publish', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.publish);
// POST /api/v1/tasks/:id/start — TASKER / BOTH
router.post('/:id/start', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), ctrl.start);
// POST /api/v1/tasks/:id/complete — TASKER / BOTH
router.post('/:id/complete', (0, authorize_1.authorize)(enums_1.UserRole.TASKER, enums_1.UserRole.BOTH), (0, validate_1.validate)(task_schema_1.completeTaskSchema), ctrl.complete);
// POST /api/v1/tasks/:id/confirm — POSTER / BOTH
router.post('/:id/confirm', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.confirm);
// POST /api/v1/tasks/:id/media — POSTER / BOTH
router.post('/:id/media', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), (0, validate_1.validate)(task_schema_1.addMediaSchema), ctrl.addMedia);
// ─── Single task CRUD ─────────────────────────────────────────────────────────
// GET /api/v1/tasks/:id
router.get('/:id', ctrl.getOne);
// PATCH /api/v1/tasks/:id — POSTER / BOTH
router.patch('/:id', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), (0, validate_1.validate)(task_schema_1.updateTaskSchema), ctrl.update);
// DELETE /api/v1/tasks/:id — POSTER / BOTH (cancels task)
router.delete('/:id', (0, authorize_1.authorize)(enums_1.UserRole.POSTER, enums_1.UserRole.BOTH), ctrl.cancel);
exports.default = router;
//# sourceMappingURL=task.route.js.map