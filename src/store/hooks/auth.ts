// ============================================================================
// FILE: store/hooks/auth.ts
// Auth-specific Redux Hooks
// ============================================================================

import { useAppSelector } from './base'

// ============================================================================
// AUTH STATE HOOKS
// ============================================================================

/**
 * Hook to get auth state
 */
export const useAuth = () => {
  return useAppSelector(state => state.auth)
}

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAppSelector(state => state.auth.isAuthenticated)
}

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useAppSelector(state => state.auth.user)
}

/**
 * Hook to get current shop
 */
export const useCurrentShop = () => {
  return useAppSelector(state => state.auth.currentShop)
}

/**
 * Hook to get permissions
 */
export const usePermissions = () => {
  return useAppSelector(state => state.auth.permissions)
}

/**
 * Hook to get shop accesses
 */
export const useShopAccesses = () => {
  return useAppSelector(state => state.auth.shopAccesses)
}

// ============================================================================
// PERMISSION HOOKS
// ============================================================================

/**
 * Hook to check if user has specific permission
 */
export const useHasPermission = (permission: string): boolean => {
  return useAppSelector(state => {
    if (!state.auth.permissions) return false
    return (state.auth.permissions as any)[permission] === true
  })
}

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: string[]): boolean => {
  return useAppSelector(state => {
    if (!state.auth.permissions) return false
    return permissions.some(
      perm => (state.auth.permissions as any)[perm] === true
    )
  })
}

/**
 * Hook to check if user has all specified permissions
 */
export const useHasAllPermissions = (permissions: string[]): boolean => {
  return useAppSelector(state => {
    if (!state.auth.permissions) return false
    return permissions.every(
      perm => (state.auth.permissions as any)[perm] === true
    )
  })
}

// ============================================================================
// ROLE HOOKS
// ============================================================================

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (role: string): boolean => {
  return useAppSelector(state => state.auth.user?.role === role)
}

/**
 * Hook to check if user is super admin
 */
export const useIsSuperAdmin = (): boolean => {
  return useAppSelector(state => state.auth.user?.role === 'super_admin')
}

/**
 * Hook to check if user is org admin
 */
export const useIsOrgAdmin = (): boolean => {
  return useAppSelector(state => {
    const role = state.auth.user?.role
    return role === 'org_admin' || role === 'super_admin'
  })
}

/**
 * Hook to check if user is shop admin
 */
export const useIsShopAdmin = (): boolean => {
  return useAppSelector(
    state => state.auth.currentShopAccess?.role === 'shop_admin'
  )
}

// ============================================================================
// LOADING STATE HOOKS
// ============================================================================

/**
 * Hook to get loading state
 */
export const useAuthLoading = () => {
  return useAppSelector(state => ({
    isLoading: state.auth.isLoading,
    isInitializing: state.auth.isInitializing,
    isRefreshing: state.auth.isRefreshing,
  }))
}

// ============================================================================
// ERROR HOOKS
// ============================================================================

/**
 * Hook to get auth error
 */
export const useAuthError = () => {
  return useAppSelector(state => state.auth.error)
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Auth State
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useCurrentShop,
  usePermissions,
  useShopAccesses,

  // Permissions
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,

  // Roles
  useHasRole,
  useIsSuperAdmin,
  useIsOrgAdmin,
  useIsShopAdmin,

  // Loading States
  useAuthLoading,

  // Errors
  useAuthError,
}
