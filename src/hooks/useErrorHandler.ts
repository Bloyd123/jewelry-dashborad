// FILE: src/hooks/useErrorHandler.ts

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

// ✅ Helper — backend message pehle, phir i18n fallback
const extractMessage = (error: any, fallbackKey: string, t: (key: string, opts?: any) => string): string => {
  return (
    error?.data?.message ||     // RTK Query — backend ka message
    error?.response?.data?.message || // Axios style
    error?.message ||           // direct JS error
    t(fallbackKey)              // i18n fallback
  )
}

export const useErrorHandler = () => {
  const { t } = useTranslation()
  const { showError } = useNotification()

  const handleError = useCallback(
    (error: any, setErrors?: (errors: Record<string, string>) => void) => {
      console.error('Error occurred:', error)

      // ── VALIDATION ERROR (400/422) ──
      if (ValidationError.isValidationError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.VALIDATION.FAILED, t)
        showError(message, t('errors.validation.title'))

        if (setErrors && error.validationErrors) {
          const translatedErrors: Record<string, string> = {}
          Object.entries(error.validationErrors).forEach(([key, value]) => {
            const strValue = String(value)
            translatedErrors[key] = strValue.startsWith('errors.') ? t(strValue) : strValue
          })
          setErrors(translatedErrors)
        }

        // RTK Query validation errors
  if (setErrors && (error as any)?.data?.validationErrors) {
  setErrors((error as any).data.validationErrors)
        }
        return
      }

      // ── AUTH ERROR (401) ──
      if (AuthError.isAuthError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.AUTH.FAILED, t)
        showError(message, t('errors.auth.title'))

        if (setErrors) {
          const invalidCreds = t(ERROR_KEYS.AUTH.INVALID_CREDENTIALS)
          setErrors({ email: invalidCreds, password: invalidCreds })
        }
        return
      }

      // ── PERMISSION ERROR (403) ──
      if (PermissionError.isPermissionError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.PERMISSION.DENIED, t)
        showError(message, t('errors.permission.title'))
        return
      }

      // ── NOT FOUND ERROR (404) ──
      if (NotFoundError.isNotFoundError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.NOT_FOUND.RESOURCE, t)
        showError(message, t('errors.notFound.title'))
        return
      }

      // ── RATE LIMIT ERROR (429) ──
      if (RateLimitError.isRateLimitError(error)) {
        const message = error.retryAfter
          ? t(ERROR_KEYS.RATE_LIMIT.RETRY_AFTER, { seconds: error.retryAfter })
          : extractMessage(error, ERROR_KEYS.RATE_LIMIT.EXCEEDED, t)
        showError(message, t('errors.rateLimit.title'))
        return
      }

      // ── SERVER ERROR (500/503) ──
      if (ServerError.isServerError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.API.SERVER, t)
        showError(message, t('errors.server.title'))
        return
      }

      // ── NETWORK ERROR ──
      if (NetworkError.isNetworkError(error)) {
        const message = extractMessage(error, ERROR_KEYS.API.NETWORK, t)
        showError(message, t('errors.network.title'))
        return
      }

      // ── GENERIC API ERROR ──
      if (ApiError.isApiError(error)) {
        const message = extractMessage(error, error.messageKey || ERROR_KEYS.API.GENERIC, t)
        showError(message, t('errors.api.title'))
        return
      }

      // ── FALLBACK ──
      const message = extractMessage(error, ERROR_KEYS.API.GENERIC, t)
      showError(message, t('errors.unknown.title'))
    },
    [t, showError]
  )

  return { handleError }
}