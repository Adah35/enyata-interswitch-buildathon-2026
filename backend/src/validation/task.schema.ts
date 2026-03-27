import { z } from 'zod';
import { TaskStatus } from '../entities/enums';

export const createTaskSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  categoryId: z.string().uuid().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationDisplay: z.string().min(3).max(200),
  locationExact: z.string().min(3).max(500),
  budgetKobo: z.number().int().positive(),
  scheduledFor: z.string().datetime().optional(),
  durationEstimate: z.string().max(100).optional(),
  mediaUrls: z.array(z.string().url()).max(5).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationDisplay: z.string().min(3).max(200).optional(),
  locationExact: z.string().min(3).max(500).optional(),
  budgetKobo: z.number().int().positive().optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
  durationEstimate: z.string().max(100).nullable().optional(),
  mediaUrls: z.array(z.string().url()).max(5).optional(),
});

export const listTasksQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  categoryId: z.string().uuid().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().default(10),
  minBudget: z.coerce.number().int().positive().optional(),
  maxBudget: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const nearbyTasksQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radiusKm: z.coerce.number().positive().default(10),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const completeTaskSchema = z.object({
  completionProofUrls: z.array(z.string().url()).optional(),
  notes: z.string().max(500).optional(),
});

export const addMediaSchema = z.object({
  mediaUrls: z.array(z.string().url()).min(1).max(5),
});
