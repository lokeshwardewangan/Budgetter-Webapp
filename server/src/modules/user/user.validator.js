import { z } from 'zod';
import { dateInput } from '../../shared/lib/validators.js';

const optionalUrl = z.union([z.literal(''), z.url('Must be a valid URL')]).optional();
// Empty string clears the DOB; otherwise dateInput coerces to Date.
const optionalDob = z.union([z.literal(''), dateInput]).optional();

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    dob: optionalDob,
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
    instagramLink: optionalUrl,
    facebookLink: optionalUrl,
    profession: z.string().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined && v !== ''), {
    message: 'At least one field must be provided',
  })
  .refine((d) => !d.newPassword || (d.currentPassword && d.currentPassword.length > 0), {
    message: 'currentPassword is required when setting newPassword',
    path: ['currentPassword'],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});
