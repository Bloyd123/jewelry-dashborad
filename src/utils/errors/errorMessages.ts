// ============================================================================
// FILE: src/utils/errors/errorMessages.ts
// Centralized error message keys and helpers
// ============================================================================

/**
 * Error message keys for i18n
 * Use these constants instead of hardcoded strings
 */
export const ERROR_KEYS = {
  // API Errors
  API: {
    GENERIC: 'errors.api.generic',
    NETWORK: 'errors.api.network',
    SERVER: 'errors.api.server',
    TIMEOUT: 'errors.api.timeout',
  },

  // Authentication Errors
  AUTH: {
    FAILED: 'errors.auth.failed',
    LOGOUT_FAILED: 'errors.auth.logout.failed',
    INVALID_CREDENTIALS: 'errors.auth.invalidCredentials',
    SESSION_EXPIRED: 'errors.auth.sessionExpired',
    UNAUTHORIZED: 'errors.auth.unauthorized',
  },

  // Validation Errors
  VALIDATION: {
    FAILED: 'errors.validation.failed',
    REQUIRED: 'errors.validation.required',
    INVALID_EMAIL: 'errors.validation.invalidEmail',
    INVALID_PASSWORD: 'errors.validation.invalidPassword',
    FIX_FORM_ERRORS: 'errors.validation.fixFormErrors',
  },

  // Permission Errors
  PERMISSION: {
    DENIED: 'errors.permission.denied',
    INSUFFICIENT_RIGHTS: 'errors.permission.insufficientRights',
  },

  // Not Found Errors
  NOT_FOUND: {
    RESOURCE: 'errors.notFound.resource',
    PAGE: 'errors.notFound.page',
  },

  // Rate Limit Errors
  RATE_LIMIT: {
    EXCEEDED: 'errors.rateLimit.exceeded',
    RETRY_AFTER: 'errors.rateLimit.retryAfter',
  },

  // Success Messages
  SUCCESS: {
    LOGIN: 'auth.login.success',
    LOGOUT: 'auth.logout.success',
    LOGOUT_SESSION_CLEARED: 'auth.logout.sessionCleared',
    REGISTER: 'auth.register.success',
  },
} as const

/**
 * Helper function to get error message key based on HTTP status code
 * @param statusCode - HTTP status code
 * @returns i18n key for the error message
 */
export const getErrorKeyByStatus = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
    case 422:
      return ERROR_KEYS.VALIDATION.FAILED
    case 401:
      return ERROR_KEYS.AUTH.FAILED
    case 403:
      return ERROR_KEYS.PERMISSION.DENIED
    case 404:
      return ERROR_KEYS.NOT_FOUND.RESOURCE
    case 429:
      return ERROR_KEYS.RATE_LIMIT.EXCEEDED
    case 500:
    case 503:
      return ERROR_KEYS.API.SERVER
    default:
      return ERROR_KEYS.API.GENERIC
  }
}

/**
 * Type for error message keys
 */
export type ErrorKey =
  (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS][keyof (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS]]
