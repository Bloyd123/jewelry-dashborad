// ============================================================================
// FILE: src/utils/errors/NetworkError.ts
// Network error class
// ============================================================================

/**
 * Network Error class
 * For network-related errors (no response from server)
 */
export class NetworkError extends Error {
  public readonly isNetworkError = true;
  public readonly code?: string;

  constructor(message: string = 'Network error. Please check your internet connection.', code?: string) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
    };
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: any): error is NetworkError {
    return error && (error.isNetworkError === true || error.code === 'ERR_NETWORK');
  }
}

export default NetworkError;