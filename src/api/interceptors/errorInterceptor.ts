// ============================================================================
// FILE: src/api/interceptors/errorInterceptor.ts
// Response interceptor to handle API errors globally
// ============================================================================

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'

import { clearSession } from '@/services/auth/sessionService'
import {
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/services/auth/tokenService'
import type { ApiResponse, ApiErrorResponse } from '@/types'
import {
  ApiError,
  AuthError,
  ValidationError,
  PermissionError,
  NotFoundError,
  ServerError,
  RateLimitError,
  NetworkError,
} from '@/utils/errors'

// ============================================================================
// ERROR INTERCEPTOR
// ============================================================================

/**
 * Setup error interceptor
 * Handles API errors globally and manages token refresh
 */
export const setupErrorInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.response.use(
    // Success response handler
    response => {
      // Log response in development mode
      if (import.meta.env.DEV) {
        console.log('📥 API Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data,
        })
      }

      return response
    },

    // Error response handler
    async (error: AxiosError<ApiErrorResponse>) => {
      // ========================================
      // NETWORK ERROR (No Response)
      // ========================================
      if (!error.response || error.code === 'ERR_NETWORK') {
        if (import.meta.env.DEV) {
          console.error('🌐 Network Error:', error.message)
        }
        return Promise.reject(
          new NetworkError(
            error.message || 'Network error. Please check your connection.',
            error.code
          )
        )
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }
      const status = error.response.status
      const message = error.response.data?.message || 'Something went wrong'
      const errors = error.response.data?.errors

      // Log error in development mode
      if (import.meta.env.DEV) {
        console.error('❌ API Error:', {
          status,
          statusText: error.response.statusText,
          url: error.config?.url,
          message,
          errors,
        })
      }

      // ========================================
      // HANDLE 401 UNAUTHORIZED (Token Refresh)
      // ========================================
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        // Check if refresh token exists
        const refreshToken = getRefreshToken()

        // No refresh token = user not logged in (e.g., login failed)
        if (!refreshToken) {
          return Promise.reject(new AuthError(message, errors))
        }

        // Has refresh token = try to refresh
        try {
          // Call refresh token endpoint
          const API_BASE_URL = axiosInstance.defaults.baseURL || ''
          const response = await axios.post<ApiResponse>(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data

          // Store new tokens
          saveAccessToken(accessToken)
          if (newRefreshToken) {
            saveRefreshToken(newRefreshToken)
          }

          // Update Authorization header in original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          // Retry original request with new token
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Token refresh failed - clear session and redirect
          clearSession()

          if (import.meta.env.DEV) {
            console.error('🔐 Session expired. Please login again.')
          }

          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }

          return Promise.reject(
            new AuthError('Session expired. Please login again.')
          )
        }
      }

      // ========================================
      // HANDLE OTHER STATUS CODES
      // ========================================
      switch (status) {
        case 400:
        case 422: {
          // Extract validation errors
          const validationErrors: Record<string, string> = {}
          if (Array.isArray(errors)) {
            errors.forEach((err: any) => {
              if (err.field) {
                validationErrors[err.field] = err.message
              }
            })
          }
          return Promise.reject(
            new ValidationError(message, errors, validationErrors)
          )
        }

        case 403:
          return Promise.reject(new PermissionError(message, errors))

        case 404:
          return Promise.reject(new NotFoundError(message, errors))

        case 429: {
          const retryAfter = error.response.headers['retry-after']
          return Promise.reject(
            new RateLimitError(
              message,
              retryAfter ? parseInt(retryAfter) : undefined,
              errors
            )
          )
        }

        case 500:
        case 503:
          return Promise.reject(new ServerError(message, status, errors))

        default:
          return Promise.reject(new ApiError(message, status, errors))
      }
    }
  )
}

// ============================================================================
// ERROR HELPER FUNCTIONS
// ============================================================================

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (ApiError.isApiError(error)) {
    return error.message
  }
  if (NetworkError.isNetworkError(error)) {
    return error.message
  }
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

/**
 * Extract validation errors from API error
 */
export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (ValidationError.isValidationError(error)) {
    return error.validationErrors
  }
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    const errors: Record<string, string> = {}
    const apiErrors = error.response.data.errors

    if (Array.isArray(apiErrors)) {
      apiErrors.forEach((err: any) => {
        if (err.field) {
          errors[err.field] = err.message
        }
      })
    }

    return errors
  }
  return {}
}

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  return AuthError.isAuthError(error)
}

/**
 * Check if error is permission error
 */
export const isPermissionError = (error: unknown): boolean => {
  return PermissionError.isPermissionError(error)
}

/**
 * Check if error is validation error
 */
export const isValidationError = (error: unknown): boolean => {
  return ValidationError.isValidationError(error)
}

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  return NetworkError.isNetworkError(error)
}

export default {
  setupErrorInterceptor,
  getErrorMessage,
  getValidationErrors,
  isAuthError,
  isPermissionError,
  isValidationError,
  isNetworkError,
}