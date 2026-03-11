// FILE: src/api/interceptors/authInterceptor.ts
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { getAccessToken } from '@/services/auth/tokenService'

export const setupAuthInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }

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
      if (import.meta.env.DEV) {
        console.error(' Request Error:', error)
      }
      return Promise.reject(error)
    }
  )
}
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

export default {
  setupAuthInterceptor,
  isAuthenticated,
}
