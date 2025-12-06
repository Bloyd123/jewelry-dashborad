// ============================================================================
// FILE: src/utils/errors/RateLimitError.ts
// Rate limit error class
// ============================================================================

import { ApiError } from './ApiError'
import { ERROR_KEYS } from './errorMessages'
/**
 * Rate Limit Error class
 * For 429 Too Many Requests errors
 */
export class RateLimitError extends ApiError {
  public readonly isRateLimitError = true
  public readonly retryAfter?: number

  constructor(
   messageKey: string = ERROR_KEYS.RATE_LIMIT.EXCEEDED,
    retryAfter?: number,
    errors?: any[]
  ) {
   super(messageKey, 429, errors, 'Too many requests') 
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RateLimitError)
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
    }
  }

  /**
   * Check if error is a rate limit error
   */
  static isRateLimitError(error: any): error is RateLimitError {
    return (
      error && (error.isRateLimitError === true || error.statusCode === 429)
    )
  }
}

export default RateLimitError
