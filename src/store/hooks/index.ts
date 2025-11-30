// ============================================================================
// FILE: store/hooks/index.ts
// Central export for all Redux hooks
// ============================================================================

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

// Re-export all shop hooks
export {
  useShops,
  useCurrentShopDetails,
  useShopPagination,
  useShopFilters,
  useShopLoading,
  useShopError,
  useFetchShops,
  useFetchShopById,
  useCreateShop,
  useUpdateShop,
  useUpdateShopSettings,
  useUpdateMetalRates,
  useDeleteShop,
  useFetchShopStatistics,
  useSetShopFilters,
  useClearShopFilters,
  useClearShopError,
  useSetCurrentShop,
  useClearCurrentShop,
  useShopById,
  useIsShopLoading,
  useShopsCount,
  useActiveShops,
  useInactiveShops,
  useVerifiedShops,
  useShopsByType,
  useShopsByCategory,
  useTotalInventoryValue,
  useTotalProducts,
  useTotalStaff,
  useShopsSummary,
  useShopsData,
  useShopData,
} from './shop.ts'
