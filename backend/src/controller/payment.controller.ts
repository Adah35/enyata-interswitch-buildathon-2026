import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  initiatePaymentLogic,
  queryPaymentStatusLogic,
  refundPaymentLogic,
} from '../logic/payment.logic';

export class PaymentController {
  /** POST /api/v1/payments/tasks/:taskId/initiate */
  initiate = asyncHandler(async (req: Request, res: Response) => {
    const data = await initiatePaymentLogic(req.user!.id, req.params.taskId);
    res.json({ success: true, data });
  });

  /** GET /api/v1/payments/tasks/:taskId/status */
  status = asyncHandler(async (req: Request, res: Response) => {
    const data = await queryPaymentStatusLogic(req.user!.id, req.params.taskId);
    res.json({ success: true, data });
  });

  /** POST /api/v1/payments/tasks/:taskId/refund — ADMIN */
  refund = asyncHandler(async (req: Request, res: Response) => {
    const data = await refundPaymentLogic(req.params.taskId, req.body.reason);
    res.json({ success: true, data });
  });
}
