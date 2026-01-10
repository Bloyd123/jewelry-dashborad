// FILE: src/api/interceptors/errorInterceptor.ts
// Axios error interceptor with i18n error keys

import { AxiosError, AxiosInstance } from 'axios'
import {
  ApiError,
  AuthError,
  ValidationError,
  PermissionError,
  NotFoundError,
  ServerError,
  RateLimitError,
  NetworkError,
  ERROR_KEYS,
  getErrorKeyByStatus,
} from '@/utils/errors'

/**
 * Axios response interceptor
 * Converts Axios errors to custom error classes with i18n keys
 */
export const errorInterceptor = (error: AxiosError<any>) => {
  // NETWORK ERROR (No response from server)

  if (!error.response) {
    throw new NetworkError(ERROR_KEYS.API.NETWORK, error.code)
  }

  const { status, data } = error.response

  // Extract message key
  const messageKey =
    data?.messageKey ||
    data?.message || // fallback if backend still sends message
    getErrorKeyByStatus(status)

  const errors = data?.errors
  const validationErrors = data?.validationErrors

  // CREATE SPECIFIC ERROR CLASS BASED ON STATUS

  switch (status) {
    case 400:
    case 422:
      throw new ValidationError(messageKey, errors, validationErrors)

    case 401:
      throw new AuthError(messageKey, errors)

    case 403:
      throw new PermissionError(messageKey, errors)

    case 404:
      throw new NotFoundError(messageKey, errors)

    case 429:
      const retryAfter =
        data?.retryAfter ||
        parseInt(error.response.headers['retry-after'] || '60')
      throw new RateLimitError(messageKey, retryAfter, errors)

    case 500:
    case 503:
      throw new ServerError(messageKey, status, errors)

    default:
      throw new ApiError(messageKey, status, errors)
  }
}

/**
 * Attach interceptor to Axios instance
 */
export const setupErrorInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    response => response,
    errorInterceptor
  )
}
