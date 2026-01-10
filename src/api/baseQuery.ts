// FILE: src/api/baseQuery.ts
// Base query with automatic token refresh

import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { APP_CONFIG } from '@/config/app.config'
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '@/services/auth/tokenService'
import { API_ENDPOINTS } from '@/api/endpoints'

// Mutex to prevent multiple refresh requests
const mutex = new Mutex()

// BASE QUERY

const baseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.API.BASE_URL,
  prepareHeaders: headers => {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// BASE QUERY WITH RE-AUTH

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until mutex is available
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  // If unauthorized, try to refresh token
  if (result.error && result.error.status === 401) {
    // Check if mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          // No refresh token, logout
          clearTokens()
          window.location.href = '/login'
          return result
        }

        // Try to refresh token
        const refreshResult = await baseQuery(
          {
            url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          // Store new tokens
          const data = refreshResult.data as any
          //   setTokens(
          //     data.data.accessToken,
          //     data.data.refreshToken,
          //     data.data.tokenId
          //   )
          saveTokens(data.data.accessToken, data.data.refreshToken)

          // Retry original request
          result = await baseQuery(args, api, extraOptions)
        } else {
          // Refresh failed, logout
          clearTokens()
          window.location.href = '/login'
        }
      } finally {
        release()
      }
    } else {
      // Wait for refresh to complete
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
