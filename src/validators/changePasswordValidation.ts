// FILE: src/validators/changePasswordValidation.ts
// Frontend Change Password Form Validation (with Zod)

import { z } from 'zod'
import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface ChangePasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(1, getRequiredMessage('Current password')),

    newPassword: z
      .string()
      .trim()
      .min(1, getRequiredMessage('New password'))
      .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(1, getRequiredMessage('Confirm password')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export function validateChangePasswordForm(
  values: ChangePasswordFormValues
): FormValidationResult<ChangePasswordFormValues> {
  const result = changePasswordSchema.safeParse(values)

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    }
  }

  const errors = result.error.issues.reduce(
    (acc, err) => {
      const path = err.path.join('.')
      acc[path] = err.message
      return acc
    },
    {} as Record<string, string>
  )

  return {
    isValid: false,
    errors: errors as any,
  }
}
