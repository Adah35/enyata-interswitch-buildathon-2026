import { z } from 'zod';

export const completeKycSchema = z.object({
  nin: z.string().length(11, 'NIN must be 11 digits'),
  bvn: z.string().length(11, 'BVN must be 11 digits'),
  passportUrl: z.string().url('Passport must be a valid URL'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const saveBankAccountSchema = z.object({
  bankCode: z.string().min(3).max(10),
  accountNumber: z.string().length(10),
  accountName: z.string().min(2).max(100), // confirmed from ISW name lookup shown to user
});

export const verifyBankQuerySchema = z.object({
  accountNumber: z.string().length(10),
  bankCode: z.string().min(3).max(10),
});

export const notificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  unreadOnly: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});
