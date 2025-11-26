// ============================================================================
// FILE: src/utils/errors/NotFoundError.ts
// Not found error class
// ============================================================================

import { ApiError } from './ApiError';

/**
 * Not Found Error class
 * For 404 Not Found errors
 */
export class NotFoundError extends ApiError {
  public readonly isNotFoundError = true;

  constructor(message: string = 'Resource not found', errors?: any[]) {
    super(message, 404, errors);
    this.name = 'NotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }

  /**
   * Check if error is a not found error
   */
  static isNotFoundError(error: any): error is NotFoundError {
    return error && (error.isNotFoundError === true || error.statusCode === 404);
  }
}

export default NotFoundError;