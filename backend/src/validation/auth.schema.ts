import { z } from 'zod';
import { UserRole } from '../entities/enums';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format e.g. +2348012345678'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Role must be POSTER, TASKER, or BOTH' }),
  }).refine((r) => r !== UserRole.ADMIN, { message: 'Cannot register as ADMIN' }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format e.g. +2348012345678'),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Phone must be in E.164 format'),
  code: z.string().min(4, 'OTP code is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
});
