// ============================================================================
// FILE: src/utils/errors/PermissionError.ts
// Permission denied error class
// ============================================================================

import { ApiError } from './ApiError';

/**
 * Permission Error class
 * For 403 Forbidden errors
 */
export class PermissionError extends ApiError {
  public readonly isPermissionError = true;

  constructor(
    message: string = 'Access denied. You do not have permission to perform this action.',
    errors?: any[]
  ) {
    super(message, 403, errors);
    this.name = 'PermissionError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }
  }

  /**
   * Check if error is a permission error
   */
  static isPermissionError(error: any): error is PermissionError {
    return error && (error.isPermissionError === true || error.statusCode === 403);
  }
}

export default PermissionError;