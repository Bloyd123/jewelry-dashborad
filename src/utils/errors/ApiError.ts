// ============================================================================
// FILE: src/utils/errors/ApiError.ts
// Custom API error class
// ============================================================================

/**
 * Custom API Error class
 * Extends native Error with additional API-specific properties
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors?: any[]
  public readonly isApiError = true
 public readonly messageKey: string 
  constructor(messageKey: string, statusCode: number, errors?: any[],fallbackMessage?: string  ) {
     super(fallbackMessage || messageKey)    
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
     this.messageKey = messageKey    

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  /**
   * Convert error to JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
        messageKey: this.messageKey, 
      statusCode: this.statusCode,
      errors: this.errors,
    }
  }

  /**
   * Check if error is an API error
   */
  static isApiError(error: any): error is ApiError {
    return error && error.isApiError === true
  }
}

export default ApiError
