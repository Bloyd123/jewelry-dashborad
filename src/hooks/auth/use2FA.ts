//
// FILE: hooks/auth/use2FA.ts
// 2FA Actions - enable / verify / disable / 2FA login / backup codes
//

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { complete2FALogin } from '@/store/slices/authSlice'

import { fetchUserProfile } from '@/store/slices/userSlice'

import * as authService from '@/api/services/authService'

//
// 2FA HOOK
//

export const use2FA = () => {
  const dispatch = useAppDispatch()

  const enable2FA = useCallback(async () => {
    try {
      const response = await authService.enable2FA()
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])

  const verify2FA = useCallback(
    async (token: string) => {
      try {
        const response = await authService.verify2FA(token)

        if (response.data.success) {
          await dispatch(fetchUserProfile())
        }

        return { success: true, data: response.data }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  const disable2FA = useCallback(
    async (password: string, token: string) => {
      try {
        const response = await authService.disable2FA(password, token)

        if (response.data.success) {
          await dispatch(fetchUserProfile())
        }

        return { success: true, data: response.data }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  const verify2FALogin = useCallback(
    async (tempToken: string, token: string) => {
      try {
        // ✅ Use the new thunk instead of calling service directly
        const result = await dispatch(
          complete2FALogin({
            tempToken,
            code: token,
            isBackupCode: false,
          })
        ).unwrap()

        if (import.meta.env.DEV) {
          console.log('✅ [useAuth] 2FA verification successful')
        }

        return { success: true, data: result }
      } catch (error: any) {
        console.error(' [useAuth] 2FA verification failed:', error)
        throw error
      }
    },
    [dispatch]
  )

  const verifyBackupCode = useCallback(
    async (tempToken: string, backupCode: string) => {
      try {
        // ✅ Use the new thunk instead of calling service directly
        const result = await dispatch(
          complete2FALogin({
            tempToken,
            code: backupCode,
            isBackupCode: true,
          })
        ).unwrap()

        if (import.meta.env.DEV) {
          console.log('✅ [useAuth] Backup code verification successful')
        }

        return { success: true, data: result }
      } catch (error: any) {
        console.error(' [useAuth] Backup code verification failed:', error)
        throw error
      }
    },
    [dispatch]
  )

  return {
    enable2FA,
    verify2FA,
    disable2FA,
    verify2FALogin,
    verifyBackupCode,
  }
}
