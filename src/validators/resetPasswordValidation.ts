// ============================================================================
// FILE: src/validators/resetPasswordValidation.ts
// Frontend Reset Password Form Validation
// ============================================================================

import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

export interface ResetPasswordFormValues {
  token: string
  newPassword: string
  confirmPassword: string
}

export function validateResetPasswordForm(
  values: ResetPasswordFormValues
): FormValidationResult<ResetPasswordFormValues> {
  const errors: Record<string, string> = {}

  // ---------------------------
  // TOKEN VALIDATION
  // ---------------------------
  if (!values.token?.trim()) {
    errors.token = getRequiredMessage('Reset token')
  }

  // ---------------------------
  // NEW PASSWORD VALIDATION
  // ---------------------------
  if (!values.newPassword?.trim()) {
    errors.newPassword = getRequiredMessage('Password')
  } else {
    const password = values.newPassword.trim()

    // Minimum length check
    if (password.length < 6) {
      errors.newPassword = VALIDATION_MESSAGES.MIN_VALUE('Password', 6)
    }
    // Password strength check (uppercase, lowercase, number)
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.newPassword = VALIDATION_MESSAGES.PASSWORD_WEAK
    }
  }

  // ---------------------------
  // CONFIRM PASSWORD VALIDATION
  // ---------------------------
  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = getRequiredMessage('Confirm password')
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors as any,
  }
}
