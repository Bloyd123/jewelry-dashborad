// 
// FILE: hooks/auth/usePasswordActions.ts
// Password Actions - changePassword / forgotPassword / resetPassword
// 

import { useCallback } from 'react'
import type { ChangePasswordRequest, ResetPasswordRequest } from '@/types'
import * as authService from '@/api/services/authService'
import { useAuthActions } from './useAuthActions'

// 
// PASSWORD ACTIONS HOOK
// 

export const usePasswordActions = () => {
  const { logout } = useAuthActions()

  const changePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      try {
        const response = await authService.changePassword(data)
        await logout()
        return { success: true, data: response.data }
      } catch (error: any) {
        throw error
      }
    },
    [logout]
  )

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await authService.forgotPassword(email)
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      try {
        const response = await authService.resetPassword(data)
        return { success: true, data: response.data }
      } catch (error: any) {
        throw error
      }
    },
    []
  )

  return {
    changePassword,
    forgotPassword,
    resetPassword,
  }
}