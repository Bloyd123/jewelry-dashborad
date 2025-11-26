// ============================================================================
// FILE: src/utils/errors/ServerError.ts
// Server error class
// ============================================================================

import { ApiError } from './ApiError';

/**
 * Server Error class
 * For 500 Internal Server Error and 503 Service Unavailable
 */
export class ServerError extends ApiError {
  public readonly isServerError = true;

  constructor(
    message: string = 'Internal server error. Please try again later.',
    statusCode: number = 500,
    errors?: any[]
  ) {
    super(message, statusCode, errors);
    this.name = 'ServerError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
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
    );
  }
}

export default ServerError;