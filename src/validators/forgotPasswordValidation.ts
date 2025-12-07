// ============================================================================
// FILE: src/validators/forgotPasswordValidation.ts
// Frontend Forgot Password Form Validation (Dynamic Required Message)
// ============================================================================

import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface ForgotPasswordFormValues {
  email: string
}

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues
): FormValidationResult<ForgotPasswordFormValues> {
  const errors: Record<string, string> = {}

  // ---------------------------
  // EMAIL VALIDATION
  // ---------------------------
  if (!values.email?.trim()) {
    errors.email = getRequiredMessage('Email')
  } else {
    const trimmedEmail = values.email.trim()

    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
      errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
    } else {
      // Additional validations to match backend
      const parts = trimmedEmail.split('@')

      // Check domain has valid structure
      if (parts[1] && !parts[1].includes('.')) {
        errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
      }

      // Check for consecutive dots
      if (trimmedEmail.includes('..')) {
        errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
      }

      // Check for valid characters (comprehensive email validation)
      const validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

      if (!validEmailRegex.test(trimmedEmail)) {
        errors.email = VALIDATION_MESSAGES.INVALID_EMAIL
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors as any,
  }
}

// Helper function to normalize email (for API submission)
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
