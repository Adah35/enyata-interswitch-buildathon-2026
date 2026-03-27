import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  submitBidLogic,
  listBidsLogic,
  acceptBidLogic,
  rejectBidLogic,
  withdrawBidLogic,
} from '../logic/bid.logic';

export class BidController {
  /** POST /api/v1/bids/tasks/:taskId/bids */
  submit = asyncHandler(async (req: Request, res: Response) => {
    const data = await submitBidLogic(req.user!.id, req.params.taskId, req.body);
    res.status(201).json({ success: true, data });
  });

  /** GET /api/v1/bids/tasks/:taskId/bids */
  list = asyncHandler(async (req: Request, res: Response) => {
    const data = await listBidsLogic(req.user!.id, req.params.taskId);
    res.json({ success: true, data });
  });

  /** PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/accept */
  accept = asyncHandler(async (req: Request, res: Response) => {
    const data = await acceptBidLogic(req.user!.id, req.params.taskId, req.params.bidId);
    res.json({ success: true, data, message: 'Bid accepted. Proceed to payment to confirm assignment.' });
  });

  /** PATCH /api/v1/bids/tasks/:taskId/bids/:bidId/reject */
  reject = asyncHandler(async (req: Request, res: Response) => {
    const data = await rejectBidLogic(req.user!.id, req.params.taskId, req.params.bidId);
    res.json({ success: true, data });
  });

  /** DELETE /api/v1/bids/tasks/:taskId/bids/:bidId */
  withdraw = asyncHandler(async (req: Request, res: Response) => {
    const data = await withdrawBidLogic(req.user!.id, req.params.taskId, req.params.bidId);
    res.json({ success: true, data, message: 'Bid withdrawn' });
  });
}
