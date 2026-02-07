import { z } from 'zod';

export const manufacturerReviewSchema = z.object({
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
  internalNote: z.string()
    .max(1000, 'Internal note must be less than 1000 characters')
    .optional(),
});

export type ManufacturerReviewFormData = z.infer<typeof manufacturerReviewSchema>;