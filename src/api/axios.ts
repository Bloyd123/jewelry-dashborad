// ============================================================================
// FILE: src/api/axios.ts
// Axios instance with interceptors configured
// ============================================================================

import axios, { AxiosInstance } from 'axios'

import { setupAuthInterceptor } from './interceptors/authInterceptor'
import { setupErrorInterceptor } from './interceptors/errorInterceptor'

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
const API_TIMEOUT = 30000 // 30 seconds

// ============================================================================
// CREATE AXIOS INSTANCE
// ============================================================================

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // For cookies/sessions if needed
})

// ============================================================================
// SETUP INTERCEPTORS
// ============================================================================

// Setup authentication interceptor (attaches token to requests)
setupAuthInterceptor(axiosInstance)

// Setup error interceptor (handles errors globally, token refresh, etc.)
setupErrorInterceptor(axiosInstance)

// ============================================================================
// RETRY LOGIC (Optional)
// ============================================================================

/**
 * Retry failed requests with exponential backoff
 * @param fn - Function that returns a promise
 * @param maxRetries - Maximum number of retry attempts
 * @param delay - Initial delay in milliseconds
 * @param backoff - Backoff multiplier
 */
export const retryRequest = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx) except 408, 429
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (
          status &&
          status >= 400 &&
          status < 500 &&
          status !== 408 &&
          status !== 429
        ) {
          throw error
        }
      }

      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const waitTime = delay * Math.pow(backoff, attempt - 1)

      // Log retry attempt in development
      if (import.meta.env.DEV) {
        console.log(
          `🔄 Retrying request (attempt ${attempt}/${maxRetries}) after ${waitTime}ms...`
        )
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}

// ============================================================================
// EXPORT
// ============================================================================

export default axiosInstance

// Named export for convenience
export { axiosInstance as api }
