// ============================================================================
// FILE: src/services/auth/sessionService.ts
// Session management service for user data and authentication state
// ============================================================================

import { setItem, getItem, removeItem } from '../storage/localStorageService';
import { removeTokens } from './tokenService';
import type { User } from '@/types';

// ============================================================================
// STORAGE KEYS
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
 * @param user - User object
 * @returns true if successful
 */
export const saveUser = (user: User): boolean => {
  try {
    return setItem(SESSION_KEYS.USER, user);
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

/**
 * Get user data from localStorage
 * @returns User object or null
 */
export const getUser = (): User | null => {
  try {
    return getItem<User>(SESSION_KEYS.USER);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 * @returns true if successful
 */
export const removeUser = (): boolean => {
  try {
    return removeItem(SESSION_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

/**
 * Update user data in localStorage
 * @param updates - Partial user object with updates
 * @returns true if successful
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
 * @param permissions - Permissions object
 * @returns true if successful
 */
export const savePermissions = (permissions: Record<string, boolean>): boolean => {
  try {
    return setItem(SESSION_KEYS.PERMISSIONS, permissions);
  } catch (error) {
    console.error('Error saving permissions:', error);
    return false;
  }
};

/**
 * Get user permissions from localStorage
 * @returns Permissions object or empty object
 */
export const getPermissions = (): Record<string, boolean> => {
  try {
    return getItem<Record<string, boolean>>(SESSION_KEYS.PERMISSIONS, {}) || {};
  } catch (error) {
    console.error('Error getting permissions:', error);
    return {};
  }
};

/**
 * Remove permissions from localStorage
 * @returns true if successful
 */
export const removePermissions = (): boolean => {
  try {
    return removeItem(SESSION_KEYS.PERMISSIONS);
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
 * @param shopId - Shop ID
 * @returns true if successful
 */
export const saveCurrentShopId = (shopId: string): boolean => {
  try {
    return setItem(SESSION_KEYS.CURRENT_SHOP_ID, shopId);
  } catch (error) {
    console.error('Error saving current shop ID:', error);
    return false;
  }
};

/**
 * Get current shop ID from localStorage
 * @returns Shop ID or null
 */
export const getCurrentShopId = (): string | null => {
  try {
    return getItem<string>(SESSION_KEYS.CURRENT_SHOP_ID);
  } catch (error) {
    console.error('Error getting current shop ID:', error);
    return null;
  }
};

/**
 * Remove current shop ID from localStorage
 * @returns true if successful
 */
export const removeCurrentShopId = (): boolean => {
  try {
    return removeItem(SESSION_KEYS.CURRENT_SHOP_ID);
  } catch (error) {
    console.error('Error removing current shop ID:', error);
    return false;
  }
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Save complete session (user, permissions, tokens)
 * @param user - User object
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 * @param permissions - User permissions (optional)
 * @returns true if successful
 */
export const saveSession = (
  user: User,
  accessToken: string,
  refreshToken: string,
  permissions?: Record<string, boolean>
): boolean => {
  try {
    const userSaved = saveUser(user);
    
    // Tokens are saved via tokenService
    setItem('accessToken', accessToken);
    setItem('refreshToken', refreshToken);
    
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
 * @returns true if successful
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
 * @returns true if authenticated
 */
export const isAuthenticated = (): boolean => {
  const user = getUser();
  const token = getItem<string>('accessToken');
  return !!(user && token);
};

/**
 * Get complete session data
 * @returns Session data or null
 */
export const getSession = () => {
  return {
    user: getUser(),
    accessToken: getItem<string>('accessToken'),
    refreshToken: getItem<string>('refreshToken'),
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
 * @returns User ID or null
 */
export const getUserId = (): string | null => {
  const user = getUser();
  return user?._id ? String(user._id) : null;
};

/**
 * Get user role from session
 * @returns User role or null
 */
export const getUserRole = (): string | null => {
  const user = getUser();
  return user?.role || null;
};

/**
 * Get user organization ID from session
 * @returns Organization ID or null
 */
export const getUserOrganizationId = (): string | null => {
  const user = getUser();
  return user?.organizationId ? String(user.organizationId) : null;
};

/**
 * Get user primary shop ID from session
 * @returns Primary shop ID or null
 */
export const getUserPrimaryShopId = (): string | null => {
  const user = getUser();
  return user?.primaryShop ? String(user.primaryShop) : null;
};

/**
 * Get user full name from session
 * @returns Full name or username
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
 * @returns Email or null
 */
export const getUserEmail = (): string | null => {
  const user = getUser();
  return user?.email || null;
};

/**
 * Check if user has specific role
 * @param role - Role to check
 * @returns true if user has the role
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user has any of the specified roles
 * @param roles - Array of roles to check
 * @returns true if user has any of the roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Check if user is super admin
 * @returns true if super admin
 */
export const isSuperAdmin = (): boolean => {
  return hasRole('super_admin');
};

/**
 * Check if user is org admin
 * @returns true if org admin
 */
export const isOrgAdmin = (): boolean => {
  return hasRole('org_admin') || isSuperAdmin();
};

/**
 * Check if user is shop admin
 * @returns true if shop admin
 */
export const isShopAdmin = (): boolean => {
  return hasRole('shop_admin');
};

/**
 * Check if user is manager or above
 * @returns true if manager or higher role
 */
export const isManagerOrAbove = (): boolean => {
  return hasAnyRole(['super_admin', 'org_admin', 'shop_admin', 'manager']);
};

// ============================================================================
// SESSION VALIDATION
// ============================================================================

/**
 * Validate session (check if user and token exist and are valid)
 * @returns true if session is valid
 */
export const validateSession = (): boolean => {
  try {
    const user = getUser();
    const token = getItem<string>('accessToken');
    
    if (!user || !token) {
      return false;
    }
    
    // Additional validation can be added here
    // For example, check if user is active
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

/**
 * Refresh session data from API
 * This should be called after login or token refresh
 */
export const refreshSessionFromAPI = async (): Promise<boolean> => {
  try {
    // This will be implemented when we create the auth API service
    // For now, just return false
    return false;
  } catch (error) {
    console.error('Error refreshing session from API:', error);
    return false;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // User Management
  saveUser,
  getUser,
  removeUser,
  updateUser,
  
  // Permissions
  savePermissions,
  getPermissions,
  removePermissions,
  
  // Shop
  saveCurrentShopId,
  getCurrentShopId,
  removeCurrentShopId,
  
  // Session
  saveSession,
  clearSession,
  isAuthenticated,
  getSession,
  validateSession,
  
  // User Info
  getUserId,
  getUserRole,
  getUserOrganizationId,
  getUserPrimaryShopId,
  getUserFullName,
  getUserEmail,
  
  // Role Checks
  hasRole,
  hasAnyRole,
  isSuperAdmin,
  isOrgAdmin,
  isShopAdmin,
  isManagerOrAbove,
};