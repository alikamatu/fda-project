import { z } from 'zod';
import { UserRole } from '@/types/auth';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const userRegisterSchemaBase = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phone: z.string()
    .optional()
    .refine(val => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  role: z.nativeEnum(UserRole),
});

export const userRegisterSchema = userRegisterSchemaBase.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const manufacturerRegisterSchemaBase = userRegisterSchemaBase.extend({
  companyName: z.string()
    .min(1, 'Company name is required')
    .min(3, 'Company name must be at least 3 characters'),
  registrationNumber: z.string()
    .min(1, 'Registration number is required'),
  contactEmail: z.string()
    .min(1, 'Contact email is required')
    .email('Invalid email address'),
  contactPhone: z.string()
    .optional()
    .refine(val => !val || /^\+?[\d\s-]{10,}$/.test(val), {
      message: 'Invalid phone number format',
    }),
  address: z.string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
});

export const manufacturerRegisterSchema = manufacturerRegisterSchemaBase.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type UserRegisterFormData = z.infer<typeof userRegisterSchema>;
export type ManufacturerRegisterFormData = z.infer<typeof manufacturerRegisterSchema>;