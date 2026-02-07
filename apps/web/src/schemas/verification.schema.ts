import { z } from 'zod';
import { VerificationStatus } from '@/types/verification';

/**
 * Zod validation schemas for verification features
 * Used for form validation and API response validation
 */

export const verificationFilterSchema = z.object({
  status: z.nativeEnum(VerificationStatus).optional(),
  search: z.string().trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const verificationLogSchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(VerificationStatus),
  location: z.string().optional(),
  ipAddress: z.string().optional(),
  deviceInfo: z.string().optional(),
  verifiedAt: z.string().datetime(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.string(),
  }).optional(),
  verificationCode: z.object({
    code: z.string(),
    productBatch: z.object({
      id: z.string().uuid(),
      batchNumber: z.string(),
      manufactureDate: z.string().datetime(),
      expiryDate: z.string().datetime(),
      product: z.object({
        id: z.string().uuid(),
        productName: z.string(),
        productCode: z.string(),
        category: z.string(),
        manufacturer: z.object({
          id: z.string().uuid(),
          companyName: z.string(),
          registrationNumber: z.string(),
        }).optional(),
      }).optional(),
    }).optional(),
  }).optional(),
});

export const verificationListResponseSchema = z.object({
  data: z.array(verificationLogSchema),
  total: z.number().nonnegative(),
  page: z.number().positive(),
  limit: z.number().positive(),
  totalPages: z.number().nonnegative(),
});

export type VerificationFilterInput = z.infer<typeof verificationFilterSchema>;
export type VerificationListResponseType = z.infer<typeof verificationListResponseSchema>;
