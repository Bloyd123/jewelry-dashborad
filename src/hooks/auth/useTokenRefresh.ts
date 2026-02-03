//
// FILE: hooks/auth/useTokenRefresh.ts
// Token Refresh - Auto refresh token hook
//

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { refreshAccessToken as refreshTokenAction } from '@/store/slices/authSlice'
import * as tokenService from '@/services/auth/tokenService'
import { useIsAuthenticated } from './useAuthState'

//
// TOKEN REFRESH HOOK
//

export const useTokenRefresh = (intervalMinutes: number = 5) => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(
      async () => {
        const token = tokenService.getAccessToken()
        if (token) {
          const timeLeft = tokenService.getTimeUntilExpiration(token)
          if (timeLeft < 300) {
            await dispatch(refreshTokenAction())
          }
        }
      },
      intervalMinutes * 60 * 1000
    )

    return () => clearInterval(interval)
  }, [isAuthenticated, dispatch, intervalMinutes])
}
