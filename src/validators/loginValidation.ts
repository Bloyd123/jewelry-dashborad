// FILE: src/validators/loginValidation.ts
// Frontend Login Form Validation (with Zod)

import { z } from 'zod'
import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface LoginFormValues {
  email: string
  password: string
}

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, getRequiredMessage('Email'))
    .email(VALIDATION_MESSAGES.INVALID_EMAIL),

  password: z
    .string()
    .trim()
    .min(1, getRequiredMessage('Password'))
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
})

export function validateLoginForm(
  values: LoginFormValues
): FormValidationResult<LoginFormValues> {
  const result = loginSchema.safeParse(values)

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
