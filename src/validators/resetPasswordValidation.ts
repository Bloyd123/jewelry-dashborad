// FILE: src/validators/resetPasswordValidation.ts
// Frontend Reset Password Form Validation (with Zod)

import { z } from 'zod'
import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface ResetPasswordFormValues {
  token: string
  newPassword: string
  confirmPassword: string
}

const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, getRequiredMessage('Reset token')),

    newPassword: z
      .string()
      .trim()
      .min(1, getRequiredMessage('Password'))
      .min(6, VALIDATION_MESSAGES.MIN_VALUE('Password', 6))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        VALIDATION_MESSAGES.PASSWORD_WEAK
      ),

    confirmPassword: z
      .string()
      .trim()
      .min(1, getRequiredMessage('Confirm password')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  })

export function validateResetPasswordForm(
  values: ResetPasswordFormValues
): FormValidationResult<ResetPasswordFormValues> {
  const result = resetPasswordSchema.safeParse(values)

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
