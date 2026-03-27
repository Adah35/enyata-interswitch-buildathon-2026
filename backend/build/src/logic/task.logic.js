"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTaskDTO = toTaskDTO;
exports.createTaskLogic = createTaskLogic;
exports.listTasksLogic = listTasksLogic;
exports.getNearbyTasksLogic = getNearbyTasksLogic;
exports.getMyPostedTasksLogic = getMyPostedTasksLogic;
exports.getMyAssignedTasksLogic = getMyAssignedTasksLogic;
exports.getTaskDetailLogic = getTaskDetailLogic;
exports.updateTaskLogic = updateTaskLogic;
exports.cancelTaskLogic = cancelTaskLogic;
exports.publishTaskLogic = publishTaskLogic;
exports.startTaskLogic = startTaskLogic;
exports.completeTaskLogic = completeTaskLogic;
exports.confirmTaskLogic = confirmTaskLogic;
exports.addTaskMediaLogic = addTaskMediaLogic;
const taskService_1 = require("../services/taskService");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
const taskService = new taskService_1.TaskService();
// ─── DTO helpers ──────────────────────────────────────────────────────────────
/**
 * Maps a Task entity to a safe response object.
 * locationExact is only included for the poster or the assigned tasker.
 */
function toTaskDTO(task, viewerId) {
    const canSeeExactLocation = task.posterId === viewerId || (task.taskerId != null && task.taskerId === viewerId);
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        category: task.category
            ? { id: task.category.id, name: task.category.name, slug: task.category.slug }
            : null,
        latitude: task.latitude,
        longitude: task.longitude,
        locationDisplay: task.locationDisplay,
        ...(canSeeExactLocation ? { locationExact: task.locationExact } : {}),
        budgetKobo: task.budgetKobo,
        finalPriceKobo: task.finalPriceKobo,
        mediaUrls: task.mediaUrls,
        scheduledFor: task.scheduledFor,
        durationEstimate: task.durationEstimate,
        completionProofUrls: task.completionProofUrls,
        completedAt: task.completedAt,
        confirmedAt: task.confirmedAt,
        autoReleaseAt: task.autoReleaseAt,
        cancelledAt: task.cancelledAt,
        cancelReason: task.cancelReason,
        poster: task.poster
            ? { id: task.poster.id, fullName: task.poster.fullName, avatarUrl: task.poster.avatarUrl }
            : { id: task.posterId },
        tasker: task.tasker
            ? { id: task.tasker.id, fullName: task.tasker.fullName, avatarUrl: task.tasker.avatarUrl }
            : null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };
}
// ─── Status transition guard ──────────────────────────────────────────────────
const ALLOWED_TRANSITIONS = {
    [enums_1.TaskStatus.DRAFT]: [enums_1.TaskStatus.OPEN, enums_1.TaskStatus.CANCELLED],
    [enums_1.TaskStatus.OPEN]: [enums_1.TaskStatus.ASSIGNED, enums_1.TaskStatus.CANCELLED],
    [enums_1.TaskStatus.ASSIGNED]: [enums_1.TaskStatus.IN_PROGRESS, enums_1.TaskStatus.CANCELLED],
    [enums_1.TaskStatus.IN_PROGRESS]: [enums_1.TaskStatus.PENDING_REVIEW],
    [enums_1.TaskStatus.PENDING_REVIEW]: [enums_1.TaskStatus.COMPLETED],
    [enums_1.TaskStatus.COMPLETED]: [],
    [enums_1.TaskStatus.CANCELLED]: [],
    [enums_1.TaskStatus.REFUNDED]: [],
};
function assertTransition(current, next) {
    if (!ALLOWED_TRANSITIONS[current]?.includes(next)) {
        throw new errors_1.BadRequestException(`Cannot transition task from ${current} to ${next}`);
    }
}
// ─── CREATE ───────────────────────────────────────────────────────────────────
async function createTaskLogic(userId, body) {
    const task = await taskService.createTask({
        posterId: userId,
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        latitude: body.latitude,
        longitude: body.longitude,
        locationDisplay: body.locationDisplay,
        locationExact: body.locationExact,
        budgetKobo: String(body.budgetKobo),
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
        durationEstimate: body.durationEstimate,
        mediaUrls: body.mediaUrls,
    });
    return toTaskDTO(task, userId);
}
// ─── LIST ─────────────────────────────────────────────────────────────────────
async function listTasksLogic(viewerId, query) {
    const { page, limit, ...filters } = query;
    const { tasks, total } = await taskService.findTasksPaginated(filters, page, limit);
    return {
        data: tasks.map((t) => toTaskDTO(t, viewerId)),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
// ─── NEARBY ───────────────────────────────────────────────────────────────────
async function getNearbyTasksLogic(viewerId, query) {
    const { lat, lng, radiusKm, page, limit } = query;
    const { tasks, total } = await taskService.findTasksPaginated({ status: enums_1.TaskStatus.OPEN, lat, lng, radiusKm }, page, limit);
    return {
        data: tasks.map((t) => toTaskDTO(t, viewerId)),
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
// ─── MY POSTED ────────────────────────────────────────────────────────────────
async function getMyPostedTasksLogic(posterId, query) {
    const { page, limit, status } = query;
    const { tasks, total } = await taskService.findTasksPaginated({ posterId, status }, page, limit);
    return {
        data: tasks.map((t) => toTaskDTO(t, posterId)),
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
// ─── MY ASSIGNED ─────────────────────────────────────────────────────────────
async function getMyAssignedTasksLogic(taskerId, query) {
    const { page, limit, status } = query;
    const { tasks, total } = await taskService.findTasksPaginated({ taskerId, status }, page, limit);
    return {
        data: tasks.map((t) => toTaskDTO(t, taskerId)),
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
}
// ─── DETAIL ───────────────────────────────────────────────────────────────────
async function getTaskDetailLogic(taskId, viewerId) {
    const task = await taskService.getTaskById(taskId, true);
    return toTaskDTO(task, viewerId);
}
// ─── UPDATE ───────────────────────────────────────────────────────────────────
async function updateTaskLogic(taskId, userId, body) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can edit this task');
    }
    if (task.status !== enums_1.TaskStatus.DRAFT && task.status !== enums_1.TaskStatus.OPEN) {
        throw new errors_1.BadRequestException('Task can only be edited while in DRAFT or OPEN status');
    }
    const updateData = {};
    const editableFields = [
        'title', 'description', 'categoryId', 'latitude', 'longitude',
        'locationDisplay', 'locationExact', 'scheduledFor', 'durationEstimate', 'mediaUrls',
    ];
    for (const key of editableFields) {
        if (body[key] !== undefined)
            updateData[key] = body[key];
    }
    if (body.budgetKobo !== undefined) {
        updateData.budgetKobo = String(body.budgetKobo);
    }
    if (body.scheduledFor !== undefined) {
        updateData.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;
    }
    const updated = await taskService.updateTaskFields(taskId, updateData);
    return toTaskDTO(updated, userId);
}
// ─── CANCEL ───────────────────────────────────────────────────────────────────
async function cancelTaskLogic(taskId, userId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can cancel this task');
    }
    assertTransition(task.status, enums_1.TaskStatus.CANCELLED);
    await taskService.updateTaskFields(taskId, {
        status: enums_1.TaskStatus.CANCELLED,
        cancelledAt: new Date(),
    });
    return { message: 'Task cancelled successfully' };
}
// ─── PUBLISH (DRAFT → OPEN) ───────────────────────────────────────────────────
async function publishTaskLogic(taskId, userId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can publish this task');
    }
    assertTransition(task.status, enums_1.TaskStatus.OPEN);
    const updated = await taskService.updateTaskFields(taskId, { status: enums_1.TaskStatus.OPEN });
    return toTaskDTO(updated, userId);
}
// ─── START (ASSIGNED → IN_PROGRESS) ──────────────────────────────────────────
async function startTaskLogic(taskId, userId) {
    const task = await taskService.getTaskById(taskId, true);
    if (task.taskerId !== userId) {
        throw new errors_1.ForbiddenException('Only the assigned tasker can start this task');
    }
    assertTransition(task.status, enums_1.TaskStatus.IN_PROGRESS);
    const updated = await taskService.updateTaskFields(taskId, {
        status: enums_1.TaskStatus.IN_PROGRESS,
    });
    return toTaskDTO(updated, userId);
}
// ─── COMPLETE (IN_PROGRESS → PENDING_REVIEW) ─────────────────────────────────
async function completeTaskLogic(taskId, userId, body) {
    const task = await taskService.getTaskById(taskId);
    if (task.taskerId !== userId) {
        throw new errors_1.ForbiddenException('Only the assigned tasker can mark this task as complete');
    }
    assertTransition(task.status, enums_1.TaskStatus.PENDING_REVIEW);
    const updated = await taskService.updateTaskFields(taskId, {
        status: enums_1.TaskStatus.PENDING_REVIEW,
        completionProofUrls: body.completionProofUrls ?? [],
        completedAt: new Date(),
    });
    return toTaskDTO(updated, userId);
}
// ─── CONFIRM (PENDING_REVIEW → COMPLETED) ────────────────────────────────────
async function confirmTaskLogic(taskId, userId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can confirm completion');
    }
    assertTransition(task.status, enums_1.TaskStatus.COMPLETED);
    const updated = await taskService.updateTaskFields(taskId, {
        status: enums_1.TaskStatus.COMPLETED,
        confirmedAt: new Date(),
    });
    // TODO: Trigger escrow.releaseToTasker(task.escrow.id) once escrow module is built
    return toTaskDTO(updated, userId);
}
// ─── ADD MEDIA ────────────────────────────────────────────────────────────────
async function addTaskMediaLogic(taskId, userId, mediaUrls) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can add media');
    }
    const merged = [...new Set([...task.mediaUrls, ...mediaUrls])].slice(0, 10);
    const updated = await taskService.updateTaskFields(taskId, { mediaUrls: merged });
    return toTaskDTO(updated, userId);
}
//# sourceMappingURL=task.logic.js.map