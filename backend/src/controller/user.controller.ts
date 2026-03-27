import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getMyProfileLogic,
  updateMyProfileLogic,
  saveBankAccountLogic,
  verifyBankAccountLogic,
  getPublicProfileLogic,
  getNotificationsLogic,
  markNotificationReadLogic,
  completeKyc,
} from '../logic/user.logic';

export class UserController {
  /** POST /api/v1/users/me/kyc */
  kycComplete = asyncHandler(async (req: Request, res: Response) => {
    const data = await completeKyc(req.user!.id, req.body);
    res.json({ success: true, data, message: 'KYC completed successfully' });
  });
  /** GET /api/v1/users/me */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const data = await getMyProfileLogic(req.user!.id);
    res.json({ success: true, data });
  });

  /** PATCH /api/v1/users/me */
  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const data = await updateMyProfileLogic(req.user!.id, req.body);
    res.json({ success: true, data });
  });

  /** POST /api/v1/users/me/bank-account */
  saveBankAccount = asyncHandler(async (req: Request, res: Response) => {
    const data = await saveBankAccountLogic(req.user!.id, req.body);
    res.json({ success: true, data, message: 'Bank account linked successfully' });
  });

  /** GET /api/v1/users/me/bank-account/verify?accountNumber=&bankCode= */
  verifyBankAccount = asyncHandler(async (req: Request, res: Response) => {
    const { accountNumber, bankCode } = req.query as {
      accountNumber: string;
      bankCode: string;
    };
    const data = await verifyBankAccountLogic(accountNumber, bankCode);
    res.json({ success: true, data });
  });

  /** GET /api/v1/users/:id — public profile */
  getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
    const data = await getPublicProfileLogic(req.params.id);
    res.json({ success: true, data });
  });

  /** GET /api/v1/users/me/notifications */
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, unreadOnly } = req.query as any;
    const result = await getNotificationsLogic(
      req.user!.id,
      Number(page) || 1,
      Number(limit) || 20,
      unreadOnly === 'true',
    );
    res.json({ success: true, ...result });
  });

  /** PATCH /api/v1/users/me/notifications/:id/read */
  markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
    const data = await markNotificationReadLogic(req.user!.id, req.params.id);
    res.json({ success: true, data });
  });
}
