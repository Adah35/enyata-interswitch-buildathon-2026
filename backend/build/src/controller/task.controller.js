"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const task_logic_1 = require("../logic/task.logic");
class TaskController {
    constructor() {
        /** POST /api/v1/tasks */
        this.create = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.createTaskLogic)(req.user.id, req.body);
            res.status(201).json({ success: true, data });
        });
        /** GET /api/v1/tasks */
        this.list = (0, express_async_handler_1.default)(async (req, res) => {
            const result = await (0, task_logic_1.listTasksLogic)(req.user.id, req.query);
            res.json({ success: true, ...result });
        });
        /** GET /api/v1/tasks/nearby */
        this.nearby = (0, express_async_handler_1.default)(async (req, res) => {
            const result = await (0, task_logic_1.getNearbyTasksLogic)(req.user.id, req.query);
            res.json({ success: true, ...result });
        });
        /** GET /api/v1/tasks/my/posted */
        this.myPosted = (0, express_async_handler_1.default)(async (req, res) => {
            const result = await (0, task_logic_1.getMyPostedTasksLogic)(req.user.id, req.query);
            res.json({ success: true, ...result });
        });
        /** GET /api/v1/tasks/my/assigned */
        this.myAssigned = (0, express_async_handler_1.default)(async (req, res) => {
            const result = await (0, task_logic_1.getMyAssignedTasksLogic)(req.user.id, req.query);
            res.json({ success: true, ...result });
        });
        /** GET /api/v1/tasks/:id */
        this.getOne = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.getTaskDetailLogic)(req.params.id, req.user.id);
            res.json({ success: true, data });
        });
        /** PATCH /api/v1/tasks/:id */
        this.update = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.updateTaskLogic)(req.params.id, req.user.id, req.body);
            res.json({ success: true, data });
        });
        /** DELETE /api/v1/tasks/:id */
        this.cancel = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.cancelTaskLogic)(req.params.id, req.user.id);
            res.json({ success: true, ...data });
        });
        /** POST /api/v1/tasks/:id/publish */
        this.publish = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.publishTaskLogic)(req.params.id, req.user.id);
            res.json({ success: true, data });
        });
        /** POST /api/v1/tasks/:id/start */
        this.start = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.startTaskLogic)(req.params.id, req.user.id);
            res.json({ success: true, data });
        });
        /** POST /api/v1/tasks/:id/complete */
        this.complete = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.completeTaskLogic)(req.params.id, req.user.id, req.body);
            res.json({ success: true, data });
        });
        /** POST /api/v1/tasks/:id/confirm */
        this.confirm = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.confirmTaskLogic)(req.params.id, req.user.id);
            res.json({ success: true, data });
        });
        /** POST /api/v1/tasks/:id/media */
        this.addMedia = (0, express_async_handler_1.default)(async (req, res) => {
            const data = await (0, task_logic_1.addTaskMediaLogic)(req.params.id, req.user.id, req.body.mediaUrls);
            res.json({ success: true, data });
        });
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map