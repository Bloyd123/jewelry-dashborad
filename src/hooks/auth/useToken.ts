//
// FILE: hooks/auth/useToken.ts
// Token Utilities - validity / expiration checks
//

import { useCallback } from 'react'
import * as tokenService from '@/services/auth/tokenService'

//
// TOKEN HOOK
//

export const useToken = () => {
  const checkTokenValidity = useCallback(() => {
    return tokenService.isAccessTokenValid()
  }, [])

  const getTokenExpiration = useCallback(() => {
    const token = tokenService.getAccessToken()
    return token ? tokenService.getTokenExpiration(token) : null
  }, [])

  return {
    checkTokenValidity,
    getTokenExpiration,
  }
}
