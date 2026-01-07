// ============================================================================
// FILE: src/config/permissions.config.ts
// BACKEND-COMPATIBLE Permissions Configuration
// ============================================================================

/**
 * ⚠️ IMPORTANT: This file should match EXACTLY with backend permissions
 * Backend: src/config/permissions.config.js
 * 
 * Total Permissions: 237
 */

export type UserRole = 'shop_admin' | 'manager' | 'staff' | 'accountant' | 'viewer'

// ============================================================================
// COMPLETE PERMISSION INTERFACE (237 permissions - matches backend)
// ============================================================================
import {ShopPermissions} from '@/types'

// ============================================================================
// PERMISSION KEY TYPE (for type-safe permission checking)
// ============================================================================

export type PermissionKey = keyof Omit<ShopPermissions, number | symbol>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * ⚠️ NOTE: Actual permissions come from backend via login response
 * These are just for type checking and reference
 */

export const hasPermission = (
  permissions: ShopPermissions | null,
  permission: PermissionKey
): boolean => {
  if (!permissions) return false;
  return permissions[permission] === true;
};

export const hasAnyPermission = (
  permissions: ShopPermissions | null,
  permissionList: PermissionKey[]
): boolean => {
  if (!permissions) return false;
  return permissionList.some(perm => permissions[perm] === true);
};

export const hasAllPermissions = (
  permissions: ShopPermissions | null,
  permissionList: PermissionKey[]
): boolean => {
  if (!permissions) return false;
  return permissionList.every(perm => permissions[perm] === true);
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};