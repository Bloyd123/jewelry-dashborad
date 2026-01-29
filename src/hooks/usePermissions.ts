// 
// FILE: hooks/usePermissions.ts
// Custom Hooks for Permission Checking
//  REFACTORED: Works with single source of truth from permissionsSlice
// 

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import type { PermissionKey } from '@/types'
import {
  selectEffectivePermissions,
  selectHasShopAccess,
  selectIsOrgLevel,
  selectCurrentShopPermissions,
  selectOrgPermissions,
  selectCurrentShopId, //  NEW: Get current shop ID
  selectActiveShopsCount, //  NEW: Get active shops count
  selectShopAccesses, //  NEW: Get all shop accesses
} from '@/store/slices/permissionsSlice'

/**
 * Check if user has a specific permission
 * Usage: const canCreateCustomer = usePermission('canCreateCustomer')
 */
export const usePermission = (permission: PermissionKey): boolean => {
  return useSelector((state: RootState) => {
    const permissions = selectEffectivePermissions(state)
    if (!permissions) return false
    return permissions[permission] === true
  })
}

/**
 * Check if user has ANY of the specified permissions
 * Usage: const canManageInventory = useAnyPermission(['canCreateProduct', 'canUpdateProduct'])
 */
export const useAnyPermission = (permissionList: PermissionKey[]): boolean => {
  return useSelector((state: RootState) => {
    const permissions = selectEffectivePermissions(state)
    if (!permissions) return false
    return permissionList.some(perm => permissions[perm] === true)
  })
}

/**
 * Check if user has ALL specified permissions
 * Usage: const canFullyManageSales = useAllPermissions(['canCreateSale', 'canUpdateSale', 'canDeleteSales'])
 */
export const useAllPermissions = (permissionList: PermissionKey[]): boolean => {
  return useSelector((state: RootState) => {
    const permissions = selectEffectivePermissions(state)
    if (!permissions) return false
    return permissionList.every(perm => permissions[perm] === true)
  })
}

/**
 * Get all effective permissions
 * Usage: const permissions = usePermissions()
 */
export const usePermissions = () => {
  return useSelector(selectEffectivePermissions)
}

/**
 * Check if user has shop access (shop-level user)
 * Usage: const hasShopAccess = useHasShopAccess()
 */
export const useHasShopAccess = (): boolean => {
  return useSelector(selectHasShopAccess)
}

/**
 * Check if user is org-level (super_admin or org_admin)
 * Usage: const isOrgLevel = useIsOrgLevel()
 */
export const useIsOrgLevel = (): boolean => {
  return useSelector(selectIsOrgLevel)
}

/**
 * Get current shop permissions (for shop-level users)
 * Usage: const shopPermissions = useCurrentShopPermissions()
 */
export const useCurrentShopPermissions = () => {
  return useSelector(selectCurrentShopPermissions)
}

/**
 * Get organization permissions (for org-level users)
 * Usage: const orgPermissions = useOrgPermissions()
 */
export const useOrgPermissions = () => {
  return useSelector(selectOrgPermissions)
}

/**
 * Get permission count
 * Usage: const count = usePermissionCount()
 */
export const usePermissionCount = (): number => {
  return useSelector((state: RootState) => {
    const permissions = selectEffectivePermissions(state)
    if (!permissions) return 0
    return Object.values(permissions).filter(value => value === true).length
  })
}

/**
 *  NEW: Get current shop ID
 * Usage: const currentShopId = useCurrentShopId()
 */
export const useCurrentShopId = (): string | null => {
  return useSelector(selectCurrentShopId)
}

/**
 *  NEW: Get active shops count
 * Usage: const activeShops = useActiveShopsCount()
 */
export const useActiveShopsCount = (): number => {
  return useSelector(selectActiveShopsCount)
}

/**
 *  NEW: Get all shop accesses (from single source)
 * Usage: const shopAccesses = useShopAccessesFromPermissions()
 */
export const useShopAccessesFromPermissions = () => {
  return useSelector(selectShopAccesses)
}

/**
 * Combined permissions check hook with detailed info
 *  ENHANCED: Added shop access info
 * Usage: 
 * const { hasPermission, permissionCount, isOrgLevel, shopAccesses, activeShops } = usePermissionInfo()
 */
export const usePermissionInfo = () => {
  const permissions = usePermissions()
  const hasShopAccess = useHasShopAccess()
  const isOrgLevel = useIsOrgLevel()
  const permissionCount = usePermissionCount()
  const currentShopId = useCurrentShopId() //  NEW
  const activeShops = useActiveShopsCount() //  NEW
  const shopAccesses = useShopAccessesFromPermissions() //  NEW
  
  return {
    // Permissions
    permissions,
    permissionCount,
    
    // User type
    hasShopAccess,
    isOrgLevel,
    
    //  NEW: Shop context
    currentShopId,
    activeShops,
    shopAccesses,
    
    // Helper functions
    hasPermission: (permission: PermissionKey) => 
      permissions?.[permission] === true,
    hasAnyPermission: (permissionList: PermissionKey[]) =>
      permissionList.some(perm => permissions?.[perm] === true),
    hasAllPermissions: (permissionList: PermissionKey[]) =>
      permissionList.every(perm => permissions?.[perm] === true),
  }
}

/**
 *  NEW: Check if user has access to specific shop
 * Usage: const hasAccessToShop = useHasShopAccessById('shop_id_123')
 */
export const useHasShopAccessById = (shopId: string): boolean => {
  return useSelector((state: RootState) => {
    const shopAccesses = selectShopAccesses(state)
    return shopAccesses.some(access => access.shopId === shopId && access.isActive)
  })
}

/**
 *  NEW: Get permissions for specific shop
 * Usage: const shopPermissions = useShopPermissionsById('shop_id_123')
 */
export const useShopPermissionsById = (shopId: string) => {
  return useSelector((state: RootState) => {
    const shopAccesses = selectShopAccesses(state)
    const shopAccess = shopAccesses.find(access => access.shopId === shopId)
    return shopAccess?.permissions || null
  })
}

/**
 *  NEW: Get user's role in specific shop
 * Usage: const role = useShopRoleById('shop_id_123')
 */
export const useShopRoleById = (shopId: string) => {
  return useSelector((state: RootState) => {
    const shopAccesses = selectShopAccesses(state)
    const shopAccess = shopAccesses.find(access => access.shopId === shopId)
    return shopAccess?.role || null
  })
}

/**
 *  NEW: Check if current shop is active
 * Usage: const isCurrentShopActive = useIsCurrentShopActive()
 */
export const useIsCurrentShopActive = (): boolean => {
  return useSelector((state: RootState) => {
    const currentShopId = selectCurrentShopId(state)
    if (!currentShopId) return false
    
    const shopAccesses = selectShopAccesses(state)
    const currentShop = shopAccesses.find(access => access.shopId === currentShopId)
    return currentShop?.isActive || false
  })
}

// Export all hooks
export default {
  // Core permission hooks
  usePermission,
  useAnyPermission,
  useAllPermissions,
  usePermissions,
  
  // User type hooks
  useHasShopAccess,
  useIsOrgLevel,
  
  // Permission getters
  useCurrentShopPermissions,
  useOrgPermissions,
  usePermissionCount,
  
  //  NEW: Shop context hooks
  useCurrentShopId,
  useActiveShopsCount,
  useShopAccessesFromPermissions,
  
  //  NEW: Shop-specific hooks
  useHasShopAccessById,
  useShopPermissionsById,
  useShopRoleById,
  useIsCurrentShopActive,
  
  // Combined info hook
  usePermissionInfo,
}