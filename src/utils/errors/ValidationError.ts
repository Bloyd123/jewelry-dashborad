// ============================================================================
// FILE: src/utils/errors/ValidationError.ts
// Validation error class
// ============================================================================

import { ApiError } from './ApiError'

/**
 * Validation Error class
 * For 422 Unprocessable Entity or 400 Bad Request errors
 */
export class ValidationError extends ApiError {
  public readonly isValidationError = true
  public readonly validationErrors: Record<string, string>

  constructor(
    message: string = 'Validation failed',
    errors?: any[],
    validationErrors: Record<string, string> = {}
  ) {
    super(message, 422, errors)
    this.name = 'ValidationError'
    this.validationErrors = validationErrors

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    }
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: any): error is ValidationError {
    return (
      error &&
      (error.isValidationError === true ||
        error.statusCode === 422 ||
        error.statusCode === 400)
    )
  }
}

export default ValidationError
