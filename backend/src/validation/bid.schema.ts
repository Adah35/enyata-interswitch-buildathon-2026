import { z } from 'zod';

export const submitBidSchema = z.object({
  amountKobo: z.number().int().positive(),
  message: z.string().max(500).optional(),
});
