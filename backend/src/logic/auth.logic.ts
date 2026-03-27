import { config } from '../config';
import { BadRequestException, UnauthorizedError, NotFoundException } from '../errors/errors';
import { UserService, RegisterInput } from '../services/userService';
import { UserRole } from '../entities/enums';
import redisClient from '../utils/redis';

const userService = new UserService();

const OTP_RATE_LIMIT_PREFIX = 'otp_rate:';
const OTP_MAX_ATTEMPTS = 3;
const OTP_WINDOW_SECONDS = 10 * 60; // 10 minutes

// Lazy-load twilio to avoid crash when credentials are not set
function getTwilioVerify() {
  const twilio = require('twilio');
  const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
  return client.verify.v2.services(config.TWILIO_VERIFY_SERVICE_SID);
}

/**
 * Register new user
 */
export const registerNewUser = async (data: RegisterInput) => {
  return userService.registerUser(data);
};

/**
 * Login user
 */
export const loginUser = async (data: { email: string; password: string }) => {
  return userService.loginUser(data.email, data.password);
};

/**
 * Refresh access token using refresh token stored in DB
 */
export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new BadRequestException('No refresh token provided');
  }
  return userService.refreshAccessToken(refreshToken);
};

/**
 * Logout — invalidates the refresh token in DB
 */
export const logoutUser = async (refreshToken: string) => {
  await userService.logout(refreshToken);
  return { message: 'Logged out successfully' };
};

/**
 * Get authenticated user's profile
 */
export const getUserAccountLogic = async (userId: string) => {
  const user = await userService.getUser(userId);
  return userService.toDTO(user);
};

/**
 * Update authenticated user's profile
 */
export const updateUserAccountLogic = async (
  userId: string,
  data: { fullName?: string; avatarUrl?: string; bio?: string }
) => {
  return userService.updateUser(userId, data);
};

/**
 * Send SMS OTP via Twilio Verify
 * Rate limit: max 3 requests per phone per 10 minutes
 */
export const sendOtpLogic = async (phone: string) => {
  const key = `${OTP_RATE_LIMIT_PREFIX}${phone}`;

  let attempts = 0;
  try {
    const val = await redisClient.get(key);
    attempts = val ? parseInt(val, 10) : 0;
  } catch {
    console.warn('Redis unavailable for OTP rate limit check');
  }

  if (attempts >= OTP_MAX_ATTEMPTS) {
    throw new BadRequestException(
      'Too many OTP requests. Please wait 10 minutes before trying again.'
    );
  }

  try {
    const verifyService = getTwilioVerify();
    await verifyService.verifications.create({ to: phone, channel: 'sms' });
  } catch (err: any) {
    throw new BadRequestException(`Failed to send OTP: ${err.message}`);
  }

  try {
    await redisClient.set(key, String(attempts + 1), { EX: OTP_WINDOW_SECONDS });
  } catch {
    console.warn('Redis unavailable — OTP rate limit not persisted');
  }

  return { message: 'OTP sent' };
};

/**
 * Verify SMS OTP via Twilio Verify, then mark phone as verified
 */
export const verifyOtpLogic = async (userId: string, phone: string, code: string) => {
  try {
    const verifyService = getTwilioVerify();
    const check = await verifyService.verificationChecks.create({ to: phone, code });

    if (check.status !== 'approved') {
      throw new UnauthorizedError('Invalid or expired OTP');
    }
  } catch (err: any) {
    if (err instanceof UnauthorizedError) throw err;
    throw new BadRequestException(`OTP verification failed: ${err.message}`);
  }

  await userService.markPhoneVerified(userId);

  try {
    await redisClient.del(`${OTP_RATE_LIMIT_PREFIX}${phone}`);
  } catch {
    // ignore
  }

  return { message: 'Phone verified' };
};
