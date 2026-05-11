import { z } from 'zod';

const optionalUrl = z
  .union([z.literal(''), z.string().url('Must be a valid URL')])
  .optional();

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    dob: z.string().optional(),
    profession: z.string().optional(),
    instagramLink: optionalUrl,
    facebookLink: optionalUrl,
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (d) =>
      (!d.currentPassword && !d.newPassword) ||
      (!!d.currentPassword && !!d.newPassword),
    {
      message: 'Provide both current and new password',
      path: ['newPassword'],
    },
  );

export const deleteAccountSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type UpdateProfileForm = z.input<typeof updateProfileSchema>;
export type DeleteAccountForm = z.input<typeof deleteAccountSchema>;
