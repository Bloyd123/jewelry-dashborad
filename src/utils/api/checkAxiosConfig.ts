// ============================================================================
// FILE: src/utils/api/checkAxiosConfig.ts
// Check and log axios configuration
// ============================================================================

import { AxiosInstance } from 'axios'

/**
 * Check if axios instance is properly configured and log details
 * @param axiosInstance - Axios instance to check
 */
export const checkAxiosConfig = (axiosInstance: AxiosInstance): void => {
  // Type assertion to access internal handlers property
  const requestHandlers = (axiosInstance.interceptors.request as any).handlers
  const responseHandlers = (axiosInstance.interceptors.response as any).handlers

  console.log('📡 Axios Configuration:', {
    baseURL: axiosInstance.defaults.baseURL,
    timeout: axiosInstance.defaults.timeout,
    headers: axiosInstance.defaults.headers,
    hasInterceptors: {
      request: Array.isArray(requestHandlers) && requestHandlers.length > 0,
      response: Array.isArray(responseHandlers) && responseHandlers.length > 0,
    },
  })
}

export default checkAxiosConfig
