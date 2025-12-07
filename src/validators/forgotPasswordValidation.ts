// ============================================================================
// FILE: src/validators/forgotPasswordValidation.ts
// Frontend Forgot Password Form Validation (with Zod)
// ============================================================================

import { z } from 'zod'
import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface ForgotPasswordFormValues {
  email: string
}

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, getRequiredMessage('Email'))
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .refine(email => {
      // Check for consecutive dots
      if (email.includes('..')) return false

      // Check domain has valid structure
      const parts = email.split('@')
      if (parts[1] && !parts[1].includes('.')) return false

      // Comprehensive email validation
      const validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

      return validEmailRegex.test(email)
    }, VALIDATION_MESSAGES.INVALID_EMAIL),
})

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues
): FormValidationResult<ForgotPasswordFormValues> {
  const result = forgotPasswordSchema.safeParse(values)

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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
