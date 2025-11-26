// ============================================================================
// FILE: src/types/index.ts
// Central export file for all TypeScript types
// ============================================================================

// ============================================================================
// COMMON TYPES
// ============================================================================
export * from './common.types';
export { default as commonTypes } from './common.types';

// ============================================================================
// AUTH TYPES
// ============================================================================
export * from './auth.types';
export { default as authTypes } from './auth.types';

// ============================================================================
// SHOP TYPES
// ============================================================================
export * from './shop.types';

// ============================================================================
// PRODUCT TYPES
// ============================================================================
export * from './product.types';

// ============================================================================
// TYPE GUARDS (Re-export from individual files)
// ============================================================================

// From common.types
export { isApiError, isPaginatedResponse, isSelectOption } from './common.types';

// From auth.types
export {
  isAuthenticated,
  isLoginResponse,
  isAuthValidationError,
  getUserDisplayName,
  getUserInitials,
  isSuperAdmin,
  isOrgAdmin,
  isShopAdmin,
  isManagerOrAbove,
  isStaffLevel,
  canAccessShop,
  getRoleLevel,
  hasHigherOrEqualRole,
} from './auth.types';