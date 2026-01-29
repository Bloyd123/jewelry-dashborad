// 
// FILE: hooks/useAuth.ts
// Authentication Hook - Complete with all methods
//  REFACTORED: Uses single source of truth for shop accesses
// 

import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import * as tokenService from '@/services/auth/tokenService'

// Auth Slice
import {
  login as loginAction,
  logout as logoutAction,
  initializeAuth,
  refreshAccessToken as refreshTokenAction,
  setCurrentShop,
  clearCurrentShop,
  complete2FALogin,
  updateLastActivity,
  clearError,
  setError,
  resetAuthState,
  selectAuth,
  selectIsAuthenticated,
  selectUserId,
  selectUserRole,
  selectCurrentShopId,
  selectShopIds,
  selectIsLoading,
  selectError,
} from '@/store/slices/authSlice'

// User Slice
import {
  fetchUserProfile,
  updateUserProfile as updateProfileAction,
  clearUserProfile,
  setUserFromLogin,
  selectUserProfile,
  selectUserLoading,
} from '@/store/slices/userSlice'

// Permissions Slice
import {
  setCurrentShopPermissions,
  setPermissionsFromLogin,
  clearPermissions,
  selectShopAccesses,
  selectCurrentShopPermissions,
  selectEffectivePermissions,
  selectHasPermission,
  selectHasAnyPermission,
  selectHasAllPermissions,
  selectActiveShopsCount, //  NEW: Get active shops count from permissionsSlice
} from '@/store/slices/permissionsSlice'

// Types
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  PermissionKey,
  UserRole,
} from '@/types'

// Additional services
import * as authService from '@/api/services/authService'

// 
// MAIN AUTH HOOK
// 

/**
 * Main authentication hook
 *  REFACTORED: Uses single source of truth from permissionsSlice
 */
export const useAuth = () => {
  const dispatch = useAppDispatch()

  //  Auth State (from authSlice) 
  const auth = useAppSelector(selectAuth)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userId = useAppSelector(selectUserId)
  const userRole = useAppSelector(selectUserRole)
  const currentShopId = useAppSelector(selectCurrentShopId)
  const shopIds = useAppSelector(selectShopIds)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)

  //  User State (from userSlice) 
  const userProfile = useAppSelector(selectUserProfile)
  const isUserLoading = useAppSelector(selectUserLoading)

  //  Permissions State (from permissionsSlice - SINGLE SOURCE) 
  const shopAccesses = useAppSelector(selectShopAccesses)
  const currentShopPermissions = useAppSelector(selectCurrentShopPermissions)
  const effectivePermissions = useAppSelector(selectEffectivePermissions)
  const activeShops = useAppSelector(selectActiveShopsCount) //  From permissionsSlice

  // 
  // AUTH ACTIONS
  // 

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        console.log('🔐 [useAuth] Login started:', credentials.email)
        const result = await dispatch(loginAction(credentials)).unwrap()
        console.log(' [useAuth] Login successful')
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error(' [useAuth] Login failed:', error)
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

  // 
  // USER PROFILE ACTIONS
  // 

  const getUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchUserProfile()).unwrap()
      return { success: true, data: result }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const updateProfile = useCallback(
    async (updates: UpdateProfileRequest) => {
      try {
        const result = await dispatch(updateProfileAction(updates)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  // 
  // PASSWORD MANAGEMENT
  // 

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

  // 
  // 2FA MANAGEMENT
  // 

  const enable2FA = useCallback(async () => {
    try {
      const response = await authService.enable2FA()
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [])

  const verify2FA = useCallback(async (token: string) => {
    try {
      const response = await authService.verify2FA(token)
      
      if (response.data.success) {
        await dispatch(fetchUserProfile())
      }
      
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const disable2FA = useCallback(async (password: string, token: string) => {
    try {
      const response = await authService.disable2FA(password, token)
      
      if (response.data.success) {
        await dispatch(fetchUserProfile())
      }
      
      return { success: true, data: response.data }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])


const verify2FALogin = useCallback(async (tempToken: string, token: string) => {
  try {
    // ✅ Use the new thunk instead of calling service directly
    const result = await dispatch(complete2FALogin({ 
      tempToken, 
      code: token, 
      isBackupCode: false 
    })).unwrap()
    
    if (import.meta.env.DEV) {
      console.log('✅ [useAuth] 2FA verification successful')
    }
    
    return { success: true, data: result }
  } catch (error: any) {
    console.error('❌ [useAuth] 2FA verification failed:', error)
    throw error
  }
}, [dispatch])

const verifyBackupCode = useCallback(async (tempToken: string, backupCode: string) => {
  try {
    // ✅ Use the new thunk instead of calling service directly
    const result = await dispatch(complete2FALogin({ 
      tempToken, 
      code: backupCode, 
      isBackupCode: true 
    })).unwrap()
    
    if (import.meta.env.DEV) {
      console.log('✅ [useAuth] Backup code verification successful')
    }
    
    return { success: true, data: result }
  } catch (error: any) {
    console.error('❌ [useAuth] Backup code verification failed:', error)
    throw error
  }
}, [dispatch])

  // 
  // SHOP MANAGEMENT
  // 

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
      dispatch(setCurrentShopPermissions(shopId))
    },
    [dispatch]
  )

  const clearShop = useCallback(() => {
    dispatch(clearCurrentShop())
  }, [dispatch])

  // 
  // SESSION MANAGEMENT
  // 

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

  // 
  // ACTIVITY TRACKING
  // 

  const trackActivity = useCallback(() => {
    dispatch(updateLastActivity())
  }, [dispatch])

  // 
  // ERROR HANDLING
  // 

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const setAuthError = useCallback(
    (error: string) => {
      dispatch(setError(error))
    },
    [dispatch]
  )

  // 
  // TOKEN UTILITIES
  // 

  const checkTokenValidity = useCallback(() => {
    return tokenService.isAccessTokenValid()
  }, [])

  const getTokenExpiration = useCallback(() => {
    const token = tokenService.getAccessToken()
    return token ? tokenService.getTokenExpiration(token) : null
  }, [])

  // 
  // RETURN HOOK API
  // 

  return {
    //  Auth State 
    isAuthenticated,
    userId,
    userRole,
    currentShopId,
    shopIds,
    isLoading,
    error,
    requires2FA: auth.requires2FA,
    tempToken: auth.tempToken,
    isInitializing: auth.isInitializing,
    
    //  User Profile 
    user: userProfile,
    isUserLoading,
    
    //  Permissions (SINGLE SOURCE) 
    shopAccesses, //  From permissionsSlice
    currentShopPermissions,
    effectivePermissions,
    activeShops, //  Derived from permissionsSlice
    
    //  Auth Actions 
    login,
    register,
    logout,
    logoutAll,
    initialize,
    refreshToken,
    
    //  User Actions 
    getUser,
    updateProfile,
    
    //  Password Actions 
    changePassword,
    forgotPassword,
    resetPassword,
    
    //  2FA Actions 
    enable2FA,
    verify2FA,
    disable2FA,
    verify2FALogin,
    verifyBackupCode,
    
    //  Shop Actions 
    switchShop,
    clearShop,
    
    //  Session Actions 
    getSessions,
    revokeSession,
    
    //  Activity 
    trackActivity,
    
    //  Error Handling 
    clearAuthError,
    setAuthError,
    
    //  Token Utilities 
    checkTokenValidity,
    getTokenExpiration,
  }
}

// 
// SIMPLIFIED HOOKS
// 

export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated)
}

export const useCurrentUser = () => {
  return useAppSelector(selectUserProfile)
}

export const useUserRole = () => {
  return useAppSelector(selectUserRole)
}

export const useCurrentShopId = () => {
  return useAppSelector(selectCurrentShopId)
}

export const useShopIds = () => {
  return useAppSelector(selectShopIds)
}

export const useShopAccesses = () => {
  return useAppSelector(selectShopAccesses) //  From permissionsSlice
}

export const usePermissions = () => {
  return useAppSelector(selectEffectivePermissions)
}

export const useHasPermission = (permission: PermissionKey): boolean => {
  return useAppSelector(state => selectHasPermission(state, permission))
}

export const useHasAnyPermission = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAnyPermission(state, permissions))
}

export const useHasAllPermissions = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAllPermissions(state, permissions))
}

export const useHasRole = (role: UserRole): boolean => {
  const userRole = useAppSelector(selectUserRole)
  return userRole === role
}

export const useIsSuperAdmin = (): boolean => {
  return useHasRole('super_admin')
}

export const useIsOrgAdmin = (): boolean => {
  return useHasRole('org_admin')
}

export const useIsShopAdmin = (): boolean => {
  return useHasRole('shop_admin')
}

export const useAuthLoading = () => {
  return useAppSelector(selectIsLoading)
}

export const useAuthError = () => {
  return useAppSelector(selectError)
}

// 
// COMPOSITE HOOKS
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

export const useAuthInitialization = () => {
  const dispatch = useAppDispatch()
  const { isInitializing } = useAppSelector(selectAuth)

  useEffect(() => {
    const init = async () => {
      try {
        await dispatch(initializeAuth()).unwrap()
      } catch (error) {
        console.error('Auth initialization failed:', error)
      }
    }
    
    init()
  }, [dispatch])

  return { isInitializing }
}

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

export const useActivityTracking = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      dispatch(updateLastActivity())
    }

    const events = ['click', 'keypress', 'scroll', 'mousemove']
    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, dispatch])
}

/**
 *  REFACTORED: Shop context from permissionsSlice
 */
export const useShopContext = () => {
  const dispatch = useAppDispatch()
  const currentShopId = useCurrentShopId()
  const shopAccesses = useShopAccesses() //  From permissionsSlice
  const permissions = usePermissions()

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
      dispatch(setCurrentShopPermissions(shopId))
    },
    [dispatch]
  )

  const currentShopAccess = useMemo(() => {
    if (!currentShopId) return null
    return shopAccesses.find(access => access.shopId === currentShopId) || null
  }, [currentShopId, shopAccesses])

  return {
    currentShopId,
    currentShopAccess,
    shopAccesses,
    permissions,
    switchShop,
    hasMultipleShops: shopAccesses.length > 1,
    hasNoShops: shopAccesses.length === 0,
  }
}

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

export default useAuth