// ============================================================================
// FILE: src/services/auth/sessionService.ts
// Session management service for user data and authentication state
// ============================================================================

import * as storage from '../storage/localStorageService';
import { removeTokens, getAccessToken } from './tokenService';
import type { User } from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const SESSION_KEYS = {
  USER: 'user',
  CURRENT_SHOP_ID: 'currentShopId',
  PERMISSIONS: 'permissions',
} as const;

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * Save user data to localStorage
 */
export const saveUser = (user: User): boolean => {
  try {
    return storage.setItem(SESSION_KEYS.USER, user);
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  try {
    return storage.getItem<User>(SESSION_KEYS.USER);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): boolean => {
  try {
    return storage.removeItem(SESSION_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

/**
 * Update user data in localStorage
 */
export const updateUser = (updates: Partial<User>): boolean => {
  try {
    const currentUser = getUser();
    if (!currentUser) return false;
    
    const updatedUser = { ...currentUser, ...updates };
    return saveUser(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// ============================================================================
// PERMISSIONS MANAGEMENT
// ============================================================================

/**
 * Save user permissions to localStorage
 */
export const savePermissions = (permissions: Record<string, boolean>): boolean => {
  try {
    return storage.setItem(SESSION_KEYS.PERMISSIONS, permissions);
  } catch (error) {
    console.error('Error saving permissions:', error);
    return false;
  }
};

/**
 * Get user permissions from localStorage
 */
export const getPermissions = (): Record<string, boolean> => {
  try {
    return storage.getItem<Record<string, boolean>>(SESSION_KEYS.PERMISSIONS, {}) || {};
  } catch (error) {
    console.error('Error getting permissions:', error);
    return {};
  }
};

/**
 * Remove permissions from localStorage
 */
export const removePermissions = (): boolean => {
  try {
    return storage.removeItem(SESSION_KEYS.PERMISSIONS);
  } catch (error) {
    console.error('Error removing permissions:', error);
    return false;
  }
};

// ============================================================================
// SHOP MANAGEMENT
// ============================================================================

/**
 * Save current shop ID to localStorage
 */
export const saveCurrentShopId = (shopId: string): boolean => {
  try {
    return storage.setItem(SESSION_KEYS.CURRENT_SHOP_ID, shopId);
  } catch (error) {
    console.error('Error saving current shop ID:', error);
    return false;
  }
};

/**
 * Get current shop ID from localStorage
 */
export const getCurrentShopId = (): string | null => {
  try {
    return storage.getItem<string>(SESSION_KEYS.CURRENT_SHOP_ID);
  } catch (error) {
    console.error('Error getting current shop ID:', error);
    return null;
  }
};

/**
 * Remove current shop ID from localStorage
 */
export const removeCurrentShopId = (): boolean => {
  try {
    return storage.removeItem(SESSION_KEYS.CURRENT_SHOP_ID);
  } catch (error) {
    console.error('Error removing current shop ID:', error);
    return false;
  }
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Save complete session (user and permissions)
 */
export const saveSession = (
  user: User,
  permissions?: Record<string, boolean>
): boolean => {
  try {
    const userSaved = saveUser(user);
    
    if (permissions) {
      savePermissions(permissions);
    }
    
    return userSaved;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

/**
 * Clear complete session (user, permissions, tokens)
 */
export const clearSession = (): boolean => {
  try {
    removeUser();
    removePermissions();
    removeCurrentShopId();
    removeTokens();
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getUser();
  const token = getAccessToken();
  return !!(user && token);
};

/**
 * Get complete session data
 */
export const getSession = () => {
  return {
    user: getUser(),
    permissions: getPermissions(),
    currentShopId: getCurrentShopId(),
    isAuthenticated: isAuthenticated(),
  };
};

// ============================================================================
// USER INFO HELPERS
// ============================================================================

/**
 * Get user ID from session
 */
export const getUserId = (): string | null => {
  const user = getUser();
  return user?._id ? String(user._id) : null;
};

/**
 * Get user role from session
 */
export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

/**
 * Get user organization ID from session
 */
export const getUserOrganizationId = (): string | null => {
  const user = getUser();
  return user?.organizationId ? String(user.organizationId) : null;
};

/**
 * Get user primary shop ID from session
 */
export const getUserPrimaryShopId = (): string | null => {
  const user = getUser();
  return user?.primaryShop ? String(user.primaryShop) : null;
};

/**
 * Get user full name from session
 */
export const getUserFullName = (): string => {
  const user = getUser();
  if (!user) return 'Guest';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  return user.firstName || user.username || 'User';
};

/**
 * Get user email from session
 */
export const getUserEmail = (): string | null => {
  const user = getUser();
  return user?.email || null;
};

// ============================================================================
// ROLE CHECKS
// ============================================================================

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (): boolean => {
  return hasRole('super_admin');
};

/**
 * Check if user is org admin
 */
export const isOrgAdmin = (): boolean => {
  return hasRole('org_admin') || isSuperAdmin();
};

/**
 * Check if user is shop admin
 */
export const isShopAdmin = (): boolean => {
  return hasRole('shop_admin');
};

/**
 * Check if user is manager or above
 */
export const isManagerOrAbove = (): boolean => {
  return hasAnyRole(['super_admin', 'org_admin', 'shop_admin', 'manager']);
};

// ============================================================================
// SESSION VALIDATION
// ============================================================================

/**
 * Validate session (check if user and token exist and are valid)
 */
export const validateSession = (): boolean => {
  try {
    const user = getUser();
    const token = getAccessToken();
    
    if (!user || !token) {
      return false;
    }
    
    if (!user.isActive) {
      clearSession();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  saveUser,
  getUser,
  removeUser,
  updateUser,
  savePermissions,
  getPermissions,
  removePermissions,
  saveCurrentShopId,
  getCurrentShopId,
  removeCurrentShopId,
  saveSession,
  clearSession,
  isAuthenticated,
  getSession,
  validateSession,
  getUserId,
  getUserRole,
  getUserOrganizationId,
  getUserPrimaryShopId,
  getUserFullName,
  getUserEmail,
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isOrgAdmin,
  isShopAdmin,
  isManagerOrAbove,
};