import { z } from 'zod';

const optionalUrl = z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional();

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    dob: z.string().optional(),
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
