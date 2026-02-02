// 
// FILE: hooks/auth/useCompositeHooks.ts
// Composite Hooks - Specialized hooks that combine multiple concerns
// 

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { login as loginAction, clearError } from '@/store/slices/authSlice'
import { useAuthLoading, useAuthError } from './useAuthState'
import type { LoginRequest } from '@/types'

// 
// LOGIN FORM HOOK
// 

export const useLoginForm = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAuthLoading()
  const error = useAuthError()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await dispatch(loginAction(credentials)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    login,
    isLoading,
    error,
    clearError: clearAuthError,
  }
}