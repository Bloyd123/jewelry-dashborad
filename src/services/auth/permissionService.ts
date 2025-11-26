// ============================================================================
// FILE: src/services/auth/permissionService.ts
// Permission checking service for user authorization
// ============================================================================

import { getPermissions, getUserRole, isSuperAdmin as checkSuperAdmin } from './sessionService';
import type { UserRole } from '@/types';

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if user has a specific permission
 * @param permission - Permission string (e.g., 'canManageProducts')
 * @returns true if user has the permission
 */
export const hasPermission = (permission: string): boolean => {
  try {
    // Super admin has all permissions
    if (checkSuperAdmin()) {
      return true;
    }
    
    const permissions = getPermissions();
    return permissions[permission] === true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Check if user has any of the specified permissions
 * @param permissions - Array of permission strings
 * @returns true if user has at least one permission
 */
export const hasAnyPermission = (permissions: string[]): boolean => {
  try {
    // Super admin has all permissions
    if (checkSuperAdmin()) {
      return true;
    }
    
    return permissions.some(permission => hasPermission(permission));
  } catch (error) {
    console.error('Error checking any permission:', error);
    return false;
  }
};

/**
 * Check if user has all of the specified permissions
 * @param permissions - Array of permission strings
 * @returns true if user has all permissions
 */
export const hasAllPermissions = (permissions: string[]): boolean => {
  try {
    // Super admin has all permissions
    if (checkSuperAdmin()) {
      return true;
    }
    
    return permissions.every(permission => hasPermission(permission));
  } catch (error) {
    console.error('Error checking all permissions:', error);
    return false;
  }
};

/**
 * Check if user can access a specific shop
 * @param shopId - Shop ID to check access for
 * @returns true if user can access the shop
 */
export const canAccessShop = (shopId: string): boolean => {
  try {
    // Super admin can access all shops
    if (checkSuperAdmin()) {
      return true;
    }
    
    // Org admin can access all shops in their organization
    const role = getUserRole();
    if (role === 'org_admin') {
      return true;
    }
    
    // Check if user has access to this specific shop
    // This would typically check against user's shop access list
    // For now, we'll check if it matches their primary shop
    const permissions = getPermissions();
    return permissions[`shop:${shopId}`] === true;
  } catch (error) {
    console.error('Error checking shop access:', error);
    return false;
  }
};

/**
 * Check if user can access multiple shops
 * @param shopIds - Array of shop IDs
 * @returns true if user can access all shops
 */
export const canAccessAllShops = (shopIds: string[]): boolean => {
  return shopIds.every(shopId => canAccessShop(shopId));
};

/**
 * Check if user can access any of the shops
 * @param shopIds - Array of shop IDs
 * @returns true if user can access at least one shop
 */
export const canAccessAnyShop = (shopIds: string[]): boolean => {
  return shopIds.some(shopId => canAccessShop(shopId));
};

// ============================================================================
// ROLE-BASED PERMISSIONS
// ============================================================================

/**
 * Check if user role has permission (role hierarchy)
 * @param requiredRole - Required role level
 * @returns true if user's role is equal or higher
 */
export const hasRoleLevel = (requiredRole: UserRole): boolean => {
  const role = getUserRole();
  if (!role) return false;
  
  const roleHierarchy: Record<string, number> = {
    super_admin: 7,
    org_admin: 6,
    shop_admin: 5,
    manager: 4,
    staff: 3,
    accountant: 2,
    viewer: 1,
  };
  
  const userLevel = roleHierarchy[role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

/**
 * Check if user is at least a manager
 * @returns true if manager or higher
 */
export const isManagerOrHigher = (): boolean => {
  return hasRoleLevel('manager' as UserRole);
};

/**
 * Check if user is at least a shop admin
 * @returns true if shop admin or higher
 */
export const isShopAdminOrHigher = (): boolean => {
  return hasRoleLevel('shop_admin' as UserRole);
};

/**
 * Check if user is at least an org admin
 * @returns true if org admin or higher
 */
export const isOrgAdminOrHigher = (): boolean => {
  return hasRoleLevel('org_admin' as UserRole);
};

// ============================================================================
// MODULE-SPECIFIC PERMISSIONS
// ============================================================================

/**
 * Check if user can manage products
 * @returns true if user can manage products
 */
export const canManageProducts = (): boolean => {
  return hasAnyPermission([
    'canManageProducts',
    'canManageInventory',
    'canEditInventory',
  ]);
};

/**
 * Check if user can view products
 * @returns true if user can view products
 */
export const canViewProducts = (): boolean => {
  return hasPermission('canViewInventory');
};

/**
 * Check if user can create products
 * @returns true if user can create products
 */
export const canCreateProducts = (): boolean => {
  return hasPermission('canManageProducts');
};

/**
 * Check if user can delete products
 * @returns true if user can delete products
 */
export const canDeleteProducts = (): boolean => {
  return hasPermission('canDeleteProducts');
};

/**
 * Check if user can manage sales
 * @returns true if user can manage sales
 */
export const canManageSales = (): boolean => {
  return hasAnyPermission([
    'canManageSales',
    'canCreateSales',
    'canEditSales',
  ]);
};

/**
 * Check if user can view sales
 * @returns true if user can view sales
 */
export const canViewSales = (): boolean => {
  return hasPermission('canViewSales');
};

/**
 * Check if user can create sales
 * @returns true if user can create sales
 */
export const canCreateSales = (): boolean => {
  return hasPermission('canCreateSales');
};

/**
 * Check if user can delete sales
 * @returns true if user can delete sales
 */
export const canDeleteSales = (): boolean => {
  return hasPermission('canDeleteSales');
};

/**
 * Check if user can apply discounts
 * @returns true if user can apply discounts
 */
export const canApplyDiscounts = (): boolean => {
  return hasPermission('canApplyDiscounts');
};

/**
 * Check if user can manage purchases
 * @returns true if user can manage purchases
 */
export const canManagePurchases = (): boolean => {
  return hasAnyPermission([
    'canManagePurchases',
    'canCreatePurchases',
    'canEditPurchases',
  ]);
};

/**
 * Check if user can view purchases
 * @returns true if user can view purchases
 */
export const canViewPurchases = (): boolean => {
  return hasPermission('canViewPurchases');
};

/**
 * Check if user can manage customers
 * @returns true if user can manage customers
 */
export const canManageCustomers = (): boolean => {
  return hasPermission('canManageCustomers');
};

/**
 * Check if user can view customers
 * @returns true if user can view customers
 */
export const canViewCustomers = (): boolean => {
  return hasPermission('canViewCustomers');
};

/**
 * Check if user can manage suppliers
 * @returns true if user can manage suppliers
 */
export const canManageSuppliers = (): boolean => {
  return hasPermission('canManageSuppliers');
};

/**
 * Check if user can view suppliers
 * @returns true if user can view suppliers
 */
export const canViewSuppliers = (): boolean => {
  return hasPermission('canViewSuppliers');
};

/**
 * Check if user can view reports
 * @returns true if user can view reports
 */
export const canViewReports = (): boolean => {
  return hasPermission('canViewReports');
};

/**
 * Check if user can generate reports
 * @returns true if user can generate reports
 */
export const canGenerateReports = (): boolean => {
  return hasPermission('canGenerateReports');
};

/**
 * Check if user can export reports
 * @returns true if user can export reports
 */
export const canExportReports = (): boolean => {
  return hasPermission('canExportReports');
};

/**
 * Check if user can manage users
 * @returns true if user can manage users
 */
export const canManageUsers = (): boolean => {
  return hasPermission('canManageUsers');
};

/**
 * Check if user can view users
 * @returns true if user can view users
 */
export const canViewUsers = (): boolean => {
  return hasPermission('canViewUsers');
};

/**
 * Check if user can manage shop settings
 * @returns true if user can manage settings
 */
export const canManageShopSettings = (): boolean => {
  return hasPermission('canManageShopSettings');
};

/**
 * Check if user can update metal rates
 * @returns true if user can update metal rates
 */
export const canUpdateMetalRates = (): boolean => {
  return hasPermission('canUpdateMetalRates');
};

/**
 * Check if user can view financials
 * @returns true if user can view financials
 */
export const canViewFinancials = (): boolean => {
  return hasPermission('canViewFinancials');
};

/**
 * Check if user can view profit/loss
 * @returns true if user can view profit/loss
 */
export const canViewProfitLoss = (): boolean => {
  return hasPermission('canViewProfitLoss');
};

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

/**
 * Get all permissions for current user
 * @returns Object with all permissions
 */
export const getAllPermissions = (): Record<string, boolean> => {
  return getPermissions();
};

/**
 * Get granted permissions (only those set to true)
 * @returns Array of granted permission names
 */
export const getGrantedPermissions = (): string[] => {
  const permissions = getPermissions();
  return Object.keys(permissions).filter(key => permissions[key] === true);
};

/**
 * Get denied permissions (only those set to false)
 * @returns Array of denied permission names
 */
export const getDeniedPermissions = (): string[] => {
  const permissions = getPermissions();
  return Object.keys(permissions).filter(key => permissions[key] === false);
};

/**
 * Count total permissions
 * @returns Number of permissions
 */
export const countPermissions = (): number => {
  return Object.keys(getPermissions()).length;
};

/**
 * Count granted permissions
 * @returns Number of granted permissions
 */
export const countGrantedPermissions = (): number => {
  return getGrantedPermissions().length;
};

// ============================================================================
// PERMISSION GROUPS
// ============================================================================

/**
 * Check if user has full inventory permissions
 * @returns true if user has all inventory permissions
 */
export const hasFullInventoryAccess = (): boolean => {
  return hasAllPermissions([
    'canViewInventory',
    'canManageInventory',
    'canManageProducts',
    'canDeleteProducts',
  ]);
};

/**
 * Check if user has full sales permissions
 * @returns true if user has all sales permissions
 */
export const hasFullSalesAccess = (): boolean => {
  return hasAllPermissions([
    'canViewSales',
    'canManageSales',
    'canCreateSales',
    'canDeleteSales',
    'canGenerateInvoices',
  ]);
};

/**
 * Check if user has full purchase permissions
 * @returns true if user has all purchase permissions
 */
export const hasFullPurchaseAccess = (): boolean => {
  return hasAllPermissions([
    'canViewPurchases',
    'canManagePurchases',
    'canCreatePurchases',
    'canDeletePurchases',
  ]);
};

/**
 * Check if user has financial access
 * @returns true if user has financial permissions
 */
export const hasFinancialAccess = (): boolean => {
  return hasAnyPermission([
    'canViewFinancials',
    'canViewProfitLoss',
    'canViewPayments',
  ]);
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Basic Permission Checks
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  
  // Shop Access
  canAccessShop,
  canAccessAllShops,
  canAccessAnyShop,
  
  // Role-Based
  hasRoleLevel,
  isManagerOrHigher,
  isShopAdminOrHigher,
  isOrgAdminOrHigher,
  
  // Module-Specific
  canManageProducts,
  canViewProducts,
  canCreateProducts,
  canDeleteProducts,
  canManageSales,
  canViewSales,
  canCreateSales,
  canDeleteSales,
  canApplyDiscounts,
  canManagePurchases,
  canViewPurchases,
  canManageCustomers,
  canViewCustomers,
  canManageSuppliers,
  canViewSuppliers,
  canViewReports,
  canGenerateReports,
  canExportReports,
  canManageUsers,
  canViewUsers,
  canManageShopSettings,
  canUpdateMetalRates,
  canViewFinancials,
  canViewProfitLoss,
  
  // Utilities
  getAllPermissions,
  getGrantedPermissions,
  getDeniedPermissions,
  countPermissions,
  countGrantedPermissions,
  
  // Permission Groups
  hasFullInventoryAccess,
  hasFullSalesAccess,
  hasFullPurchaseAccess,
  hasFinancialAccess,
};