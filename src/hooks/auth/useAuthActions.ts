// 
// FILE: hooks/auth/useAuthActions.ts
// Auth Actions - login / register / logout / refresh / initialize
// 

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
  login as loginAction,
  logout as logoutAction,
  initializeAuth,
  refreshAccessToken as refreshTokenAction,
  resetAuthState,
  clearError,
  setError,
} from '@/store/slices/authSlice'

import {
  clearUserProfile,
} from '@/store/slices/userSlice'

import {
  clearPermissions,
} from '@/store/slices/permissionsSlice'

import type { LoginRequest, RegisterRequest } from '@/types'
import * as authService from '@/api/services/authService'

// 
// AUTH ACTIONS HOOK
// 

export const useAuthActions = () => {
  const dispatch = useAppDispatch()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        console.log('🔐 [useAuth] Login started:', credentials.email)
        const result = await dispatch(loginAction(credentials)).unwrap()
        console.log('✅ [useAuth] Login successful')
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error('❌ [useAuth] Login failed:', error)
        throw error
      }
    },
    [dispatch]
  )

  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        const response = await authService.register(userData)
        return { success: true, data: response.data }
      } catch (error: any) {
        throw error
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap()
      return { success: true }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAllDevices()
      
      dispatch(resetAuthState())
      dispatch(clearUserProfile())
      dispatch(clearPermissions())
      
      return { success: true }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const initialize = useCallback(async () => {
    try {
      await dispatch(initializeAuth()).unwrap()
      return { success: true }
    } catch (error: any) {
      return { success: false }
    }
  }, [dispatch])

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshTokenAction()).unwrap()
      return { success: true }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const setAuthError = useCallback(
    (error: string) => {
      dispatch(setError(error))
    },
    [dispatch]
  )

  return {
    login,
    register,
    logout,
    logoutAll,
    initialize,
    refreshToken,
    clearAuthError,
    setAuthError,
  }
}