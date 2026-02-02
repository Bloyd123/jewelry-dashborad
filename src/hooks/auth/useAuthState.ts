// 
// FILE: hooks/auth/useAuthState.ts
// Auth State Selectors - Exports all state from auth/user/permissions slices
// 

import { useAppSelector } from '@/store/hooks'
import {
  selectAuth,
  selectIsAuthenticated,
  selectUserId,
  selectUserRole,
  selectCurrentShopId,
  selectShopIds,
  selectIsLoading,
  selectError,
} from '@/store/slices/authSlice'

import {
  selectUserProfile,
  selectUserLoading,
} from '@/store/slices/userSlice'

import {
  selectShopAccesses,
  selectCurrentShopPermissions,
  selectEffectivePermissions,
  selectActiveShopsCount,
} from '@/store/slices/permissionsSlice'

// 
// MAIN STATE HOOK
// 

export const useAuthState = () => {
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
  const activeShops = useAppSelector(selectActiveShopsCount)

  return {
    //  Auth State 
    auth,
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
    shopAccesses,
    currentShopPermissions,
    effectivePermissions,
    activeShops,
  }
}

// 
// SIMPLE SELECTORS
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
  return useAppSelector(selectShopAccesses)
}

export const useAuthLoading = () => {
  return useAppSelector(selectIsLoading)
}

export const useAuthError = () => {
  return useAppSelector(selectError)
}