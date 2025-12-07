// ============================================================================
// FILE: src/utils/errors/ServerError.ts
// Server error class
// ============================================================================

import { ApiError } from './ApiError'
import { ERROR_KEYS } from './errorMessages'

/**
 * Server Error class
 * For 500 Internal Server Error and 503 Service Unavailable
 */
export class ServerError extends ApiError {
  public readonly isServerError = true

  constructor(
    messageKey: string = ERROR_KEYS.API.SERVER,
    statusCode: number = 500,
    errors?: any[]
  ) {
    super(messageKey, statusCode, errors, 'Internal server error')
    this.name = 'ServerError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError)
    }
  }

  /**
   * Check if error is a server error
   */
  static isServerError(error: any): error is ServerError {
    return (
      error &&
      (error.isServerError === true ||
        error.statusCode === 500 ||
        error.statusCode === 503)
    )
  }
}

export default ServerError
