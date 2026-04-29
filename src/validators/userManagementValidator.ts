// FILE: src/validators/userManagementValidator.ts

import { z } from 'zod'

// ── Admin Reset Password ───────────────────────────────────
export const adminResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, 'validation.minLength6')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'validation.passwordStrength'
      ),
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordsDoNotMatch',
    path: ['confirmPassword'],
  })

export type AdminResetPasswordFormData = z.infer<typeof adminResetPasswordSchema>

// ── User Filters ───────────────────────────────────────────
export const userFiltersSchema = z.object({
  search:     z.string().optional(),
  role:       z.string().optional(),
  department: z.string().optional(),
  isActive:   z.boolean().optional(),
})

export type UserFiltersFormData = z.infer<typeof userFiltersSchema>