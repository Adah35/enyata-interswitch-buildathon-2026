import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  registerNewUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserAccountLogic,
  updateUserAccountLogic,
  sendOtpLogic,
  verifyOtpLogic,
} from '../logic/auth.logic';

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await registerNewUser(req.body);

    res
      .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
      .status(201)
      .json({
        success: true,
        message: 'Registration successful',
        data: { user, accessToken, refreshToken },
      });
  });

  /**
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res
      .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
      .json({
        success: true,
        message: 'Login successful',
        data: { user, accessToken, refreshToken },
      });
  });

  /**
   * POST /api/v1/auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const { accessToken, refreshToken } = await refreshAccessToken(token);

    res
      .cookie('accessToken', accessToken, ACCESS_COOKIE_OPTS)
      .cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS)
      .json({
        success: true,
        data: { accessToken, refreshToken },
      });
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await logoutUser(token);

    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({ success: true, message: 'Logged out successfully' });
  });

  /**
   * POST /api/v1/auth/send-otp
   */
  sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phone } = req.body;
    const result = await sendOtpLogic(phone);
    res.json({ success: true, data: result });
  });

  /**
   * POST /api/v1/auth/verify-otp
   * Requires authentication — user must be logged in to verify their phone
   */
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { phone, code } = req.body;
    const result = await verifyOtpLogic(req.user!.id, phone, code);
    res.json({ success: true, data: result });
  });
}
	