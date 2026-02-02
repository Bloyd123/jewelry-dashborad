// 
// FILE: hooks/auth/index.ts
// Main Export File - Exports all auth hooks
// 

// Main Hook
export { useAuth, default } from './useAuth'

// State Selectors
export {
  useAuthState,
  useIsAuthenticated,
  useCurrentUser,
  useUserRole,
  useCurrentShopId,
  useShopIds,
  useShopAccesses,
  useAuthLoading,
  useAuthError,
} from './useAuthState'

// Auth Actions
export { useAuthActions } from './useAuthActions'

// User Profile
export { useUserProfile } from './useUserProfile'

// Password Actions
export { usePasswordActions } from './usePasswordActions'

// 2FA
export { use2FA } from './use2FA'

// Shop Management
export { useShopActions, useShopContext } from './useShop'

// Permissions
export {
  usePermissions,
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useIsSuperAdmin,
  useIsOrgAdmin,
  useIsShopAdmin,
  usePermissionCheck,
} from './usePermissions'

// Session Management
export { useSession } from './useSession'

// Token Utilities
export { useToken } from './useToken'

// Activity Tracking
export { useActivityAction, useActivityTracking } from './useActivity'

// Initialization
export { useAuthInitialization } from './useAuthInitialization'

// Token Refresh
export { useTokenRefresh } from './useTokenRefresh'

// Composite Hooks
export { useLoginForm } from './useCompositeHooks'