// FILE: src/api/interceptors/errorInterceptor.ts

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

export const errorInterceptor = (error: AxiosError<any>) => {
  if (!error.response) {
    throw new NetworkError(ERROR_KEYS.API.NETWORK, error.code)
  }

  const { status, data } = error.response

  const messageKey = data?.messageKey || data?.message
  getErrorKeyByStatus(status)

  const errors = data?.errors
  const validationErrors = data?.validationErrors

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
export const setupErrorInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    response => response,
    errorInterceptor
  )
}
