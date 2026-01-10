// FILE: src/utils/errors/AuthError.ts
// Authentication error class

import { ApiError } from './ApiError'
import { ERROR_KEYS } from './errorMessages'
/**
 * Authentication Error class
 * For 401 Unauthorized errors
 */
export class AuthError extends ApiError {
  public readonly isAuthError = true

  constructor(messageKey: string = ERROR_KEYS.AUTH.FAILED, errors?: any[]) {
    super(messageKey, 401, errors, 'Authentication failed')
    this.name = 'AuthError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError)
    }
  }

  /**
   * Check if error is an auth error
   */
  static isAuthError(error: any): error is AuthError {
    return error && (error.isAuthError === true || error.statusCode === 401)
  }
}

export default AuthError
