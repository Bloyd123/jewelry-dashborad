// FILE: src/api/interceptors/authInterceptor.ts
// Request interceptor to attach authentication token

import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { getAccessToken } from '@/services/auth/tokenService'

// AUTH INTERCEPTOR

/**
 * Setup authentication interceptor
 * Attaches JWT token to all outgoing requests
 */
export const setupAuthInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from token service (which uses localStorage)
      const token = getAccessToken()

      // Add Authorization header if token exists
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Log request in development mode
      if (import.meta.env.DEV) {
        console.log('📤 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: config.headers,
          data: config.data,
          params: config.params,
        })
      }

      return config
    },
    (error: AxiosError) => {
      // Log request error in development
      if (import.meta.env.DEV) {
        console.error(' Request Error:', error)
      }
      return Promise.reject(error)
    }
  )
}

// HELPER FUNCTIONS

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

export default {
  setupAuthInterceptor,
  isAuthenticated,
}
