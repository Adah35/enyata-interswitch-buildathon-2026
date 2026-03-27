import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTaskLogic,
  listTasksLogic,
  getNearbyTasksLogic,
  getMyPostedTasksLogic,
  getMyAssignedTasksLogic,
  getTaskDetailLogic,
  updateTaskLogic,
  cancelTaskLogic,
  publishTaskLogic,
  startTaskLogic,
  completeTaskLogic,
  confirmTaskLogic,
  addTaskMediaLogic,
} from '../logic/task.logic';

export class TaskController {
  /** POST /api/v1/tasks */
  create = asyncHandler(async (req: Request, res: Response) => {
    const data = await createTaskLogic(req.user!.id, req.body);
    res.status(201).json({ success: true, data });
  });

  /** GET /api/v1/tasks */
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await listTasksLogic(req.user!.id, req.query as any);
    res.json({ success: true, ...result });
  });

  /** GET /api/v1/tasks/nearby */
  nearby = asyncHandler(async (req: Request, res: Response) => {
    const result = await getNearbyTasksLogic(req.user!.id, req.query as any);
    res.json({ success: true, ...result });
  });

  /** GET /api/v1/tasks/my/posted */
  myPosted = asyncHandler(async (req: Request, res: Response) => {
    const result = await getMyPostedTasksLogic(req.user!.id, req.query as any);
    res.json({ success: true, ...result });
  });

  /** GET /api/v1/tasks/my/assigned */
  myAssigned = asyncHandler(async (req: Request, res: Response) => {
    const result = await getMyAssignedTasksLogic(req.user!.id, req.query as any);
    res.json({ success: true, ...result });
  });

  /** GET /api/v1/tasks/:id */
  getOne = asyncHandler(async (req: Request, res: Response) => {
    const data = await getTaskDetailLogic(req.params.id, req.user!.id);
    res.json({ success: true, data });
  });

  /** PATCH /api/v1/tasks/:id */
  update = asyncHandler(async (req: Request, res: Response) => {
    const data = await updateTaskLogic(req.params.id, req.user!.id, req.body);
    res.json({ success: true, data });
  });

  /** DELETE /api/v1/tasks/:id */
  cancel = asyncHandler(async (req: Request, res: Response) => {
    const data = await cancelTaskLogic(req.params.id, req.user!.id);
    res.json({ success: true, ...data });
  });

  /** POST /api/v1/tasks/:id/publish */
  publish = asyncHandler(async (req: Request, res: Response) => {
    const data = await publishTaskLogic(req.params.id, req.user!.id);
    res.json({ success: true, data });
  });

  /** POST /api/v1/tasks/:id/start */
  start = asyncHandler(async (req: Request, res: Response) => {
    const data = await startTaskLogic(req.params.id, req.user!.id);
    res.json({ success: true, data });
  });

  /** POST /api/v1/tasks/:id/complete */
  complete = asyncHandler(async (req: Request, res: Response) => {
    const data = await completeTaskLogic(req.params.id, req.user!.id, req.body);
    res.json({ success: true, data });
  });

  /** POST /api/v1/tasks/:id/confirm */
  confirm = asyncHandler(async (req: Request, res: Response) => {
    const data = await confirmTaskLogic(req.params.id, req.user!.id);
    res.json({ success: true, data });
  });

  /** POST /api/v1/tasks/:id/media */
  addMedia = asyncHandler(async (req: Request, res: Response) => {
    const data = await addTaskMediaLogic(req.params.id, req.user!.id, req.body.mediaUrls);
    res.json({ success: true, data });
  });
}
