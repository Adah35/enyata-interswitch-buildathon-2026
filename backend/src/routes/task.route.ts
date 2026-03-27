import { Router } from 'express';
import { TaskController } from '../controller/task.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksQuerySchema,
  nearbyTasksQuerySchema,
  completeTaskSchema,
  addMediaSchema,
} from '../validation/task.schema';
import { UserRole } from '../entities/enums';

const router = Router();
const ctrl = new TaskController();

// All task routes require authentication
router.use(authMiddleware);

// ─── Collection-style routes — must come before /:id ─────────────────────────

// GET /api/v1/tasks/nearby — TASKER / BOTH
router.get(
  '/nearby',
  authorize(UserRole.TASKER, UserRole.BOTH),
  validate(nearbyTasksQuerySchema, 'query'),
  ctrl.nearby,
);

// GET /api/v1/tasks/my/posted
router.get('/my/posted', validate(listTasksQuerySchema, 'query'), ctrl.myPosted);

// GET /api/v1/tasks/my/assigned
router.get('/my/assigned', validate(listTasksQuerySchema, 'query'), ctrl.myAssigned);

// ─── Root collection ──────────────────────────────────────────────────────────

// POST /api/v1/tasks — POSTER / BOTH
router.post(
  '/',
  authorize(UserRole.POSTER, UserRole.BOTH),
  validate(createTaskSchema),
  ctrl.create,
);

// GET /api/v1/tasks
router.get('/', validate(listTasksQuerySchema, 'query'), ctrl.list);

// ─── Task lifecycle actions — before /:id plain GET ──────────────────────────

// POST /api/v1/tasks/:id/publish — POSTER / BOTH
router.post('/:id/publish', authorize(UserRole.POSTER, UserRole.BOTH), ctrl.publish);

// POST /api/v1/tasks/:id/start — TASKER / BOTH
router.post('/:id/start', authorize(UserRole.TASKER, UserRole.BOTH), ctrl.start);

// POST /api/v1/tasks/:id/complete — TASKER / BOTH
router.post(
  '/:id/complete',
  authorize(UserRole.TASKER, UserRole.BOTH),
  validate(completeTaskSchema),
  ctrl.complete,
);

// POST /api/v1/tasks/:id/confirm — POSTER / BOTH
router.post('/:id/confirm', authorize(UserRole.POSTER, UserRole.BOTH), ctrl.confirm);

// POST /api/v1/tasks/:id/media — POSTER / BOTH
router.post(
  '/:id/media',
  authorize(UserRole.POSTER, UserRole.BOTH),
  validate(addMediaSchema),
  ctrl.addMedia,
);

// ─── Single task CRUD ─────────────────────────────────────────────────────────

// GET /api/v1/tasks/:id
router.get('/:id', ctrl.getOne);

// PATCH /api/v1/tasks/:id — POSTER / BOTH
router.patch(
  '/:id',
  authorize(UserRole.POSTER, UserRole.BOTH),
  validate(updateTaskSchema),
  ctrl.update,
);

// DELETE /api/v1/tasks/:id — POSTER / BOTH (cancels task)
router.delete('/:id', authorize(UserRole.POSTER, UserRole.BOTH), ctrl.cancel);

export default router;
