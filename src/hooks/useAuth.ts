// FILE: hooks/auth.ts
// Authentication Hooks - Custom hooks for auth operations

import { useCallback, useEffect, useMemo } from 'react'

import * as tokenService from '@/services/auth/tokenService'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  logoutAll as logoutAllAction,
  getCurrentUser,
  updateProfile as updateProfileAction,
  changePassword as changePasswordAction,
  refreshAccessToken as refreshTokenAction,
  initializeAuth,
  setCurrentShop,
  clearCurrentShop,
  updateLastActivity,
  clearError,
  setError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  forgotPassword as forgotPasswordAction,
  selectError,
  resetPassword as resetPasswordAction,
  selectCurrentShop,
  selectPermissions,
  selectShopAccesses,
  getActiveSessions as getActiveSessionsAction,
  revokeSession as revokeSessionAction,
  selectActiveSessions,
  selectIsSessionsLoading,
  selectIsRevokingSession,
  selectHasPermission,
  selectHasRole,
  selectHasAnyPermission,
  selectHasAllPermissions,
} from '@/store/slices/authSlice'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  PermissionKey,
  ForgetRequest,
} from '@/types'

// MAIN AUTH HOOK

/**
 * Main authentication hook
 * Provides all auth state and actions
 */
export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)

  // LOGIN

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await dispatch(loginAction(credentials)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        // ✅ Just throw - LoginForm will catch and handle
        throw error
      }
    },
    [dispatch]
  )

  // FORGOT PASSWORD

  const forgotPassword = useCallback(
    async (credentials: ForgetRequest) => {
      try {
        const result = await dispatch(
          forgotPasswordAction(credentials)
        ).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  // RESET PASSWORD

  const resetPassword = useCallback(
    async (credentials: ResetPasswordRequest) => {
      try {
        const result = await dispatch(resetPasswordAction(credentials)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  // REGISTER

  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        const result = await dispatch(registerAction(userData)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        return { success: false, error: error || 'Registration failed' }
      }
    },
    [dispatch]
  )

  // LOGOUT

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutAction()).unwrap()
      return { success: true }
    } catch (error: any) {
      //  Throw error for component to handle with useErrorHandler
      // Note: User is still logged out locally (tokens cleared in thunk)
      throw error
    }
  }, [dispatch])

  // LOGOUT ALL DEVICES

  const logoutAll = useCallback(async () => {
    try {
      await dispatch(logoutAllAction()).unwrap()
      return { success: true }
    } catch (error: any) {
      return { success: true }
    }
  }, [dispatch])
  //  : GET ACTIVE SESSIONS
  const getSessions = useCallback(async () => {
    try {
      const result = await dispatch(getActiveSessionsAction()).unwrap()
      return { success: true, data: result }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  //  : REVOKE SESSION
  const revokeUserSession = useCallback(
    async (tokenId: string) => {
      try {
        await dispatch(revokeSessionAction(tokenId)).unwrap()
        return { success: true }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )
  // GET CURRENT USER

  const getUser = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser()).unwrap()
      return { success: true, data: result }
    } catch (error: any) {
      return { success: false, error: error || 'Failed to fetch user' }
    }
  }, [dispatch])

  // UPDATE PROFILE

  const updateProfile = useCallback(
    async (updates: UpdateProfileRequest) => {
      try {
        const result = await dispatch(updateProfileAction(updates)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        return { success: false, error: error || 'Profile update failed' }
      }
    },
    [dispatch]
  )

  // CHANGE PASSWORD

  const changePassword = useCallback(
    async (data: ChangePasswordRequest) => {
      try {
        await dispatch(changePasswordAction(data)).unwrap()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error || 'Password change failed' }
      }
    },
    [dispatch]
  )

  // REFRESH TOKEN

  const refreshToken = useCallback(async () => {
    try {
      await dispatch(refreshTokenAction()).unwrap()
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error || 'Token refresh failed' }
    }
  }, [dispatch])

  // INITIALIZE AUTH

  const initialize = useCallback(async () => {
    try {
      await dispatch(initializeAuth()).unwrap()
      return { success: true }
    } catch (error: any) {
      return { success: false }
    }
  }, [dispatch])

  // SHOP MANAGEMENT

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
    },
    [dispatch]
  )
  const clearShop = useCallback(() => {
    dispatch(clearCurrentShop())
  }, [dispatch])

  // ACTIVITY TRACKING

  const trackActivity = useCallback(() => {
    dispatch(updateLastActivity())
  }, [dispatch])

  // ERROR HANDLING

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const setAuthError = useCallback(
    (error: string) => {
      dispatch(setError(error))
    },
    [dispatch]
  )

  // TOKEN UTILITIES

  const checkTokenValidity = useCallback(() => {
    return tokenService.isAccessTokenValid()
  }, [])

  const getTokenExpiration = useCallback(() => {
    const token = tokenService.getAccessToken()
    return token ? tokenService.getTokenExpiration(token) : null
  }, [])

  return {
    // State
    ...auth,

    // Actions
    login,
    register,
    logout,
    logoutAll,
    getUser,
    updateProfile,
    changePassword,
    resetPassword,
    forgotPassword,
    refreshToken,
    initialize,
    getSessions,
    revokeUserSession,
    // Shop Management
    switchShop,
    clearShop,

    // Activity
    trackActivity,

    // Error Handling
    clearAuthError,
    setAuthError,

    // Token Utilities
    checkTokenValidity,
    getTokenExpiration,
  }
}

// SIMPLIFIED HOOKS

/**
 * Check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated)
}

/**
 * Get current user
 */
export const useCurrentUser = () => {
  return useAppSelector(selectUser)
}

/**
 * Get current shop
 */
export const useCurrentShop = () => {
  return useAppSelector(selectCurrentShop)
}

/**
 * Get user permissions for current shop
 */
export const usePermissions = () => {
  return useAppSelector(selectPermissions)
}

/**
 * Get all shop accesses
 */
export const useShopAccesses = () => {
  return useAppSelector(selectShopAccesses)
}

/**
 * Check if user has specific permission
 */
export const useHasPermission = (permission: PermissionKey): boolean => {
  return useAppSelector(state => selectHasPermission(state, permission))
}

/**
 * Check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAnyPermission(state, permissions))
}

/**
 * Check if user has all specified permissions
 */
export const useHasAllPermissions = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAllPermissions(state, permissions))
}

/**
 * Check if user has specific role
 */
export const useHasRole = (role: string): boolean => {
  return useAppSelector(state => selectHasRole(state, role))
}

/**
 * Check if user is super admin
 */
export const useIsSuperAdmin = (): boolean => {
  return useHasRole('super_admin')
}

/**
 * Check if user is organization admin
 */
export const useIsOrgAdmin = (): boolean => {
  return useHasRole('org_admin')
}

/**
 * Check if user is shop admin
 */
export const useIsShopAdmin = (): boolean => {
  return useHasRole('shop_admin')
}

/**
 * Get auth loading state
 */
export const useAuthLoading = () => {
  return useAppSelector(selectIsLoading)
}

/**
 * Get auth error
 */
export const useAuthError = () => {
  return useAppSelector(selectError)
}

// COMPOSITE HOOKS

/**
 * Hook for login form
 * Provides login function and state
 */
export const useLoginForm = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAuthLoading()
  const error = useAuthError()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        await dispatch(loginAction(credentials)).unwrap()
        return { success: true }
      } catch (error: any) {
        return { success: false, error }
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

/**
 * Hook for register form
 */
export const useRegisterForm = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAuthLoading()
  const error = useAuthError()

  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        await dispatch(registerAction(userData)).unwrap()
        return { success: true }
      } catch (error: any) {
        return { success: false, error }
      }
    },
    [dispatch]
  )

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    register,
    isLoading,
    error,
    clearError: clearAuthError,
  }
}

/**
 * Hook for auto-initialization on app start
 */
export const useAuthInitialization = () => {
  const dispatch = useAppDispatch()
  const { isInitializing } = useAppSelector(selectAuth)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return { isInitializing }
}

/**
 * Hook for automatic token refresh
 */
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
          // Refresh if less than 5 minutes left
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

/**
 * Hook for activity tracking
 */
export const useActivityTracking = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      dispatch(updateLastActivity())
    }

    // Track various user activities
    window.addEventListener('click', handleActivity)
    window.addEventListener('keypress', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('mousemove', handleActivity)

    return () => {
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keypress', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('mousemove', handleActivity)
    }
  }, [isAuthenticated, dispatch])
}

/**
 * Hook for shop-specific operations
 */
export const useShopContext = () => {
  const dispatch = useAppDispatch()
  const currentShop = useCurrentShop()
  const shopAccesses = useShopAccesses()
  const permissions = usePermissions()

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
    },
    [dispatch]
  )

  const currentShopAccess = useMemo(() => {
    if (!currentShop) return null
    return shopAccesses.find(access => access.shopId === currentShop) || null
  }, [currentShop, shopAccesses])

  return {
    currentShop,
    currentShopAccess,
    shopAccesses,
    permissions,
    switchShop,
    hasMultipleShops: shopAccesses.length > 1,
    hasNoShops: shopAccesses.length === 0,
  }
}

/**
 * Hook for permission-based rendering
 */
export const usePermissionCheck = () => {
  const permissions = usePermissions()

  const can = useCallback(
    (permission: PermissionKey): boolean => {
      return permissions?.[permission] === true
    },
    [permissions]
  )

  const canAny = useCallback(
    (perms: PermissionKey[]): boolean => {
      return perms.some(perm => permissions?.[perm] === true)
    },
    [permissions]
  )

  const canAll = useCallback(
    (perms: PermissionKey[]): boolean => {
      return perms.every(perm => permissions?.[perm] === true)
    },
    [permissions]
  )

  return { can, canAny, canAll, permissions }
}

// DEFAULT EXPORT

export default useAuth
