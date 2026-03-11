// FILE: src/api/axios.ts

import axios, { AxiosInstance } from 'axios'

import { setupAuthInterceptor } from './interceptors/authInterceptor'
import { setupErrorInterceptor } from './interceptors/errorInterceptor'
import { APP_CONFIG } from '@/config/app.config'


const axiosInstance: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.API.BASE_URL,
  timeout: APP_CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, 
})
setupAuthInterceptor(axiosInstance)
setupErrorInterceptor(axiosInstance)
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

      if (attempt === maxRetries) {
        throw lastError
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1)

      if (import.meta.env.DEV) {
        console.log(
          ` Retrying request (attempt ${attempt}/${maxRetries}) after ${waitTime}ms...`
        )
      }

      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}

// EXPORT

export default axiosInstance

// Named export for convenience
export { axiosInstance as api }
