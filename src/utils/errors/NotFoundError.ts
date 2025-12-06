// ============================================================================
// FILE: src/utils/errors/NotFoundError.ts
// Not found error class
// ============================================================================

import { ApiError } from './ApiError'
import { ERROR_KEYS } from './errorMessages'
/**
 * Not Found Error class
 * For 404 Not Found errors
 */
export class NotFoundError extends ApiError {
  public readonly isNotFoundError = true

  constructor( messageKey: string = ERROR_KEYS.NOT_FOUND.RESOURCE, errors?: any[]) {
   super(messageKey, 404, errors, 'Resource not found')
    this.name = 'NotFoundError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }
  }

  /**
   * Check if error is a not found error
   */
  static isNotFoundError(error: any): error is NotFoundError {
    return error && (error.isNotFoundError === true || error.statusCode === 404)
  }
}

export default NotFoundError
