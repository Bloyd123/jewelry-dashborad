//
// FILE: hooks/auth/useSession.ts
// Session Management - getSessions / revokeSession / logoutAll
//

import { useCallback } from 'react'
import * as authService from '@/api/services/authService'

//
// SESSION HOOK
//

export const useSession = () => {
  const getSessions = useCallback(async () => {
    try {
      const response = await authService.getActiveSessions()
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])

  const revokeSession = useCallback(async (tokenId: string) => {
    try {
      const response = await authService.revokeSession(tokenId)
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])
    const resendVerificationEmail = useCallback(async () => {
    try {
      const response = await authService.resendVerificationEmail()
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])
  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await authService.verifyEmail(token)
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])

  return {
    getSessions,
    revokeSession,
     resendVerificationEmail,
       verifyEmail,
  }
}
