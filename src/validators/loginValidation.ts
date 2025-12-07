// ============================================================================
// FILE: src/validators/loginValidation.ts
// Frontend Login Form Validation (Dynamic Required Message)
// ============================================================================

import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface LoginFormValues {
  email: string
  password: string
}

export function validateLoginForm(
  values: LoginFormValues
): FormValidationResult<LoginFormValues> {
  const errors: Record<string, string> = {}

  // ---------------------------
  // EMAIL VALIDATION
  // ---------------------------
  if (!values.email?.trim()) {
    errors.email = getRequiredMessage('Email')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(values.email)) {
      errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
    }
  }

  // ---------------------------
  // PASSWORD VALIDATION
  // ---------------------------
  if (!values.password?.trim()) {
    errors.password = getRequiredMessage('Password')
  } else if (values.password.length < 6) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors as any,
  }
}
