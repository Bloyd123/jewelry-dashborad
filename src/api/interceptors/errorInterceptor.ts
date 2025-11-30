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
import type { ApiResponse, ApiErrorResponse as ApiErrorType } from '@/types'

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
    async (error: AxiosError<ApiErrorType>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Log error in development mode
      if (import.meta.env.DEV) {
        console.error('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
          errors: error.response?.data?.errors,
        })
      }

      // ========================================
      // HANDLE 401 UNAUTHORIZED (Token Expired)
      // ========================================
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const refreshToken = getRefreshToken()

          // No refresh token available
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

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

          // Store new tokens using token service
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
          // Token refresh failed - clear all session data
          clearSession()

          // Show notification (if toast system is available)
          if (typeof window !== 'undefined') {
            console.error('🔐 Session expired. Please login again.')
          }

          // Redirect to login page
          window.location.href = '/login'

          return Promise.reject(refreshError)
        }
      }

      // ========================================
      // HANDLE 403 FORBIDDEN (Permission Denied)
      // ========================================
      if (error.response?.status === 403) {
        const message =
          error.response.data?.message ||
          'Access denied. You do not have permission to perform this action.'
        console.error('🚫 Permission Denied:', message)
      }

      // ========================================
      // HANDLE 404 NOT FOUND
      // ========================================
      if (error.response?.status === 404) {
        const message = error.response.data?.message || 'Resource not found.'
        console.error('🔍 Not Found:', message)
      }

      // ========================================
      // HANDLE 422 VALIDATION ERROR
      // ========================================
      if (error.response?.status === 422) {
        const message = error.response.data?.message || 'Validation failed.'
        const validationErrors = error.response.data?.errors || []
        console.error('⚠️ Validation Error:', message, validationErrors)
      }

      // ========================================
      // HANDLE 429 TOO MANY REQUESTS
      // ========================================
      if (error.response?.status === 429) {
        const message =
          error.response.data?.message ||
          'Too many requests. Please try again later.'
        console.error('⏱️ Rate Limited:', message)
      }

      // ========================================
      // HANDLE 500 INTERNAL SERVER ERROR
      // ========================================
      if (error.response?.status === 500) {
        const message =
          error.response.data?.message ||
          'Internal server error. Please try again later.'
        console.error('💥 Server Error:', message)
      }

      // ========================================
      // HANDLE 503 SERVICE UNAVAILABLE
      // ========================================
      if (error.response?.status === 503) {
        const message =
          error.response.data?.message ||
          'Service temporarily unavailable. Please try again later.'
        console.error('🔧 Service Unavailable:', message)
      }

      // ========================================
      // HANDLE NETWORK ERROR (No Response)
      // ========================================
      if (!error.response) {
        console.error('🌐 Network Error:', error.message)
      }

      // Reject with original error
      return Promise.reject(error)
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
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401
  }
  return false
}

/**
 * Check if error is permission error
 */
export const isPermissionError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 403
  }
  return false
}

/**
 * Check if error is validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 422 || error.response?.status === 400
  }
  return false
}

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response && error.code === 'ERR_NETWORK'
  }
  return false
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
