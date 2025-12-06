// ============================================================================
// FILE: src/hooks/useErrorHandler.ts
// Centralized error handler with i18n support
// ============================================================================

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotification } from '@/hooks/useNotification'
import {
  ApiError,
  ValidationError,
  AuthError,
  NetworkError,
  PermissionError,
  NotFoundError,
  ServerError,
  RateLimitError,
  ERROR_KEYS,
} from '@/utils/errors'

/**
 * Custom hook for centralized error handling with i18n support
 * @returns Object with handleError function
 */
export const useErrorHandler = () => {
  const { t } = useTranslation() 
    const {  showError } = useNotification()

  /**
   * Handle any error with automatic translation and appropriate UI feedback
   * @param error - Any error object
   * @param setErrors - Optional setState function for form validation errors
   */
  const handleError = useCallback(
    (error: any, setErrors?: (errors: Record<string, string>) => void) => {
      // Log error for debugging (remove in production if needed)
      console.error('Error occurred:', error)

      // ======================================
      // VALIDATION ERROR (400/422)
      // ======================================
      if (ValidationError.isValidationError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.VALIDATION.FAILED)
        const title = t('errors.validation.title')
        showError(message, title)
        
        if (setErrors && error.validationErrors) {
          // Translate validation errors if they are i18n keys
          const translatedErrors: Record<string, string> = {}
          Object.entries(error.validationErrors).forEach(([key, value]) => {
            const strValue = String(value)
            // Check if it's an i18n key (starts with 'errors.')
            translatedErrors[key] = strValue.startsWith('errors.')
              ? t(strValue)
              : strValue
          })
          setErrors(translatedErrors)
        }
        return
      }

      // ======================================
      // AUTH ERROR (401)
      // ======================================
      if (AuthError.isAuthError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.AUTH.FAILED)
        const title = t('errors.auth.title')
        showError(message, title)
        
        if (setErrors) {
          const invalidCreds = t(ERROR_KEYS.AUTH.INVALID_CREDENTIALS)
          setErrors({
            email: invalidCreds,
            password: invalidCreds,
          })
        }
        return
      }

      // ======================================
      // PERMISSION ERROR (403)
      // ======================================
      if (PermissionError.isPermissionError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.PERMISSION.DENIED)
        const title = t('errors.permission.title')
        showError(message, title)
        return
      }

      // ======================================
      // NOT FOUND ERROR (404)
      // ======================================
      if (NotFoundError.isNotFoundError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.NOT_FOUND.RESOURCE)
        const title = t('errors.notFound.title')
        showError(message, title)
        return
      }

      // ======================================
      // RATE LIMIT ERROR (429)
      // ======================================
      if (RateLimitError.isRateLimitError(error)) {
        const message = error.retryAfter
          ? t(ERROR_KEYS.RATE_LIMIT.RETRY_AFTER, { seconds: error.retryAfter })
          : t(ERROR_KEYS.RATE_LIMIT.EXCEEDED)
        const title = t('errors.rateLimit.title')
        showError(message, title)
        return
      }

      // ======================================
      // SERVER ERROR (500/503)
      // ======================================
      if (ServerError.isServerError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.API.SERVER)
        const title = t('errors.server.title')
        showError(message, title)
        return
      }

      // ======================================
      // NETWORK ERROR
      // ======================================
      if (NetworkError.isNetworkError(error)) {
        const message = t(ERROR_KEYS.API.NETWORK)
        const title = t('errors.network.title')
        showError(message, title)
        return
      }

      // ======================================
      // GENERIC API ERROR
      // ======================================
      if (ApiError.isApiError(error)) {
        const message = t(error.messageKey || ERROR_KEYS.API.GENERIC)
        const title = t('errors.api.title')
        showError(message, title)
        return
      }

      // ======================================
      // FALLBACK (Unknown error)
      // ======================================
      const message = t(ERROR_KEYS.API.GENERIC)
      const title = t('errors.unknown.title')
      showError(message, title)
    },
    [t, showError]
  )

  return { handleError }
}