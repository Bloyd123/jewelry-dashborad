// ============================================================================
// FILE: src/utils/errors/AuthError.ts
// Authentication error class
// ============================================================================

import { ApiError } from './ApiError';

/**
 * Authentication Error class
 * For 401 Unauthorized errors
 */
export class AuthError extends ApiError {
  public readonly isAuthError = true;

  constructor(message: string = 'Authentication failed', errors?: any[]) {
    super(message, 401, errors);
    this.name = 'AuthError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  /**
   * Check if error is an auth error
   */
  static isAuthError(error: any): error is AuthError {
    return error && (error.isAuthError === true || error.statusCode === 401);
  }
}

export default AuthError;