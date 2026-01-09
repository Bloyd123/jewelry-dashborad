// FILE: store/hooks/index.ts
// Central export for all Redux hooks

// Re-export base hooks
export { useAppDispatch, useAppSelector } from './base'

// Re-export all auth hooks
export {
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useCurrentShop,
  usePermissions,
  useShopAccesses,
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useIsSuperAdmin,
  useIsOrgAdmin,
  useIsShopAdmin,
  useAuthLoading,
  useAuthError,
} from './auth.ts'
