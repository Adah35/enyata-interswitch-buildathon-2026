import { z } from 'zod';

export const refundPaymentSchema = z.object({
  reason: z.string().min(5).max(500),
});
