// FILE: src/api/baseQuery.ts

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

const mutex = new Mutex()


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


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          clearTokens()
          window.location.href = '/login'
          return result
        }

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
          const data = refreshResult.data as any
          saveTokens(data.data.accessToken, data.data.refreshToken)

          result = await baseQuery(args, api, extraOptions)
        } else {
          clearTokens()
          window.location.href = '/login'
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
