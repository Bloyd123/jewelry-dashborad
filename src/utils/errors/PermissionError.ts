// ============================================================================
// FILE: src/utils/errors/PermissionError.ts
// Permission denied error class
// ============================================================================

import { ApiError } from './ApiError'
import { ERROR_KEYS } from './errorMessages'
/**
 * Permission Error class
 * For 403 Forbidden errors
 */
export class PermissionError extends ApiError {
  public readonly isPermissionError = true

  constructor(
    messageKey: string = ERROR_KEYS.PERMISSION.DENIED,
    errors?: any[]
  ) {
    super(messageKey, 403, errors, 'Access denied')
    this.name = 'PermissionError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError)
    }
  }

  /**
   * Check if error is a permission error
   */
  static isPermissionError(error: any): error is PermissionError {
    return (
      error && (error.isPermissionError === true || error.statusCode === 403)
    )
  }
}

export default PermissionError
