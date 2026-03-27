import { AppDataSource } from '../connection/data-source';
import { TaskService } from '../services/taskService';
import { Task } from '../entities/Task.entity';
import { TaskStatus, UserRole } from '../entities/enums';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../errors/errors';

const taskService = new TaskService();

// ─── DTO helpers ──────────────────────────────────────────────────────────────

/**
 * Maps a Task entity to a safe response object.
 * locationExact is only included for the poster or the assigned tasker.
 */
export function toTaskDTO(task: Task, viewerId?: string) {
  const canSeeExactLocation =
    task.posterId === viewerId || (task.taskerId != null && task.taskerId === viewerId);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category: task.category
      ? { id: task.category.id, name: (task.category as any).name, slug: (task.category as any).slug }
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

const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.DRAFT]: [TaskStatus.OPEN, TaskStatus.CANCELLED],
  [TaskStatus.OPEN]: [TaskStatus.ASSIGNED, TaskStatus.CANCELLED],
  [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.PENDING_REVIEW],
  [TaskStatus.PENDING_REVIEW]: [TaskStatus.COMPLETED],
  [TaskStatus.COMPLETED]: [],
  [TaskStatus.CANCELLED]: [],
  [TaskStatus.REFUNDED]: [],
};

function assertTransition(current: TaskStatus, next: TaskStatus) {
  if (!ALLOWED_TRANSITIONS[current]?.includes(next)) {
    throw new BadRequestException(
      `Cannot transition task from ${current} to ${next}`,
    );
  }
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createTaskLogic(
  userId: string,
  body: {
    title: string;
    description: string;
    categoryId?: string;
    latitude: number;
    longitude: number;
    locationDisplay: string;
    locationExact: string;
    budgetKobo: number;
    scheduledFor?: string;
    durationEstimate?: string;
    mediaUrls?: string[];
  },
) {
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

export async function listTasksLogic(
  viewerId: string,
  query: {
    status?: TaskStatus;
    categoryId?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    minBudget?: number;
    maxBudget?: number;
    page: number;
    limit: number;
  },
) {
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

export async function getNearbyTasksLogic(
  viewerId: string,
  query: { lat: number; lng: number; radiusKm: number; page: number; limit: number },
) {
  const { lat, lng, radiusKm, page, limit } = query;
  const { tasks, total } = await taskService.findTasksPaginated(
    { status: TaskStatus.OPEN, lat, lng, radiusKm },
    page,
    limit,
  );

  return {
    data: tasks.map((t) => toTaskDTO(t, viewerId)),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── MY POSTED ────────────────────────────────────────────────────────────────

export async function getMyPostedTasksLogic(
  posterId: string,
  query: { page: number; limit: number; status?: TaskStatus },
) {
  const { page, limit, status } = query;
  const { tasks, total } = await taskService.findTasksPaginated(
    { posterId, status },
    page,
    limit,
  );
  return {
    data: tasks.map((t) => toTaskDTO(t, posterId)),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── MY ASSIGNED ─────────────────────────────────────────────────────────────

export async function getMyAssignedTasksLogic(
  taskerId: string,
  query: { page: number; limit: number; status?: TaskStatus },
) {
  const { page, limit, status } = query;
  const { tasks, total } = await taskService.findTasksPaginated(
    { taskerId, status },
    page,
    limit,
  );
  return {
    data: tasks.map((t) => toTaskDTO(t, taskerId)),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── DETAIL ───────────────────────────────────────────────────────────────────

export async function getTaskDetailLogic(taskId: string, viewerId: string) {
  const task = await taskService.getTaskById(taskId, true);
  return toTaskDTO(task, viewerId);
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateTaskLogic(
  taskId: string,
  userId: string,
  body: Record<string, unknown>,
) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can edit this task');
  }
  if (task.status !== TaskStatus.DRAFT && task.status !== TaskStatus.OPEN) {
    throw new BadRequestException('Task can only be edited while in DRAFT or OPEN status');
  }

  const updateData: Partial<Task> = {};
  const editableFields = [
    'title', 'description', 'categoryId', 'latitude', 'longitude',
    'locationDisplay', 'locationExact', 'scheduledFor', 'durationEstimate', 'mediaUrls',
  ];
  for (const key of editableFields) {
    if (body[key] !== undefined) (updateData as any)[key] = body[key];
  }
  if (body.budgetKobo !== undefined) {
    updateData.budgetKobo = String(body.budgetKobo);
  }
  if (body.scheduledFor !== undefined) {
    updateData.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor as string) : null;
  }

  const updated = await taskService.updateTaskFields(taskId, updateData);
  return toTaskDTO(updated, userId);
}

// ─── CANCEL ───────────────────────────────────────────────────────────────────

export async function cancelTaskLogic(taskId: string, userId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can cancel this task');
  }
  assertTransition(task.status, TaskStatus.CANCELLED);

  await taskService.updateTaskFields(taskId, {
    status: TaskStatus.CANCELLED,
    cancelledAt: new Date(),
  });
  return { message: 'Task cancelled successfully' };
}

// ─── PUBLISH (DRAFT → OPEN) ───────────────────────────────────────────────────

export async function publishTaskLogic(taskId: string, userId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can publish this task');
  }
  assertTransition(task.status, TaskStatus.OPEN);

  const updated = await taskService.updateTaskFields(taskId, { status: TaskStatus.OPEN });
  return toTaskDTO(updated, userId);
}

// ─── START (ASSIGNED → IN_PROGRESS) ──────────────────────────────────────────

export async function startTaskLogic(taskId: string, userId: string) {
  const task = await taskService.getTaskById(taskId, true);

  if (task.taskerId !== userId) {
    throw new ForbiddenException('Only the assigned tasker can start this task');
  }
  assertTransition(task.status, TaskStatus.IN_PROGRESS);

  const updated = await taskService.updateTaskFields(taskId, {
    status: TaskStatus.IN_PROGRESS,
  });
  return toTaskDTO(updated, userId);
}

// ─── COMPLETE (IN_PROGRESS → PENDING_REVIEW) ─────────────────────────────────

export async function completeTaskLogic(
  taskId: string,
  userId: string,
  body: { completionProofUrls?: string[]; notes?: string },
) {
  const task = await taskService.getTaskById(taskId);

  if (task.taskerId !== userId) {
    throw new ForbiddenException('Only the assigned tasker can mark this task as complete');
  }
  assertTransition(task.status, TaskStatus.PENDING_REVIEW);

  const updated = await taskService.updateTaskFields(taskId, {
    status: TaskStatus.PENDING_REVIEW,
    completionProofUrls: body.completionProofUrls ?? [],
    completedAt: new Date(),
  });
  return toTaskDTO(updated, userId);
}

// ─── CONFIRM (PENDING_REVIEW → COMPLETED) ────────────────────────────────────

export async function confirmTaskLogic(taskId: string, userId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can confirm completion');
  }
  assertTransition(task.status, TaskStatus.COMPLETED);

  const updated = await taskService.updateTaskFields(taskId, {
    status: TaskStatus.COMPLETED,
    confirmedAt: new Date(),
  });

  // TODO: Trigger escrow.releaseToTasker(task.escrow.id) once escrow module is built

  return toTaskDTO(updated, userId);
}

// ─── ADD MEDIA ────────────────────────────────────────────────────────────────

export async function addTaskMediaLogic(
  taskId: string,
  userId: string,
  mediaUrls: string[],
) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can add media');
  }

  const merged = [...new Set([...task.mediaUrls, ...mediaUrls])].slice(0, 10);
  const updated = await taskService.updateTaskFields(taskId, { mediaUrls: merged });
  return toTaskDTO(updated, userId);
}
