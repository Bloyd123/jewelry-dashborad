// ============================================================================
// FILE: src/constants/roles.ts
// Role Constants and Helper Functions for Frontend
// ============================================================================

/**
 * 🎯 USER ROLES ENUM
 * Defines all possible user roles in the system
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  SHOP_ADMIN = 'shop_admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

/**
 * 🎯 ROLE LABELS (For Display in UI)
 * Human-readable role names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ORG_ADMIN]: 'Organization Admin',
  [UserRole.SHOP_ADMIN]: 'Shop Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.STAFF]: 'Staff',
  [UserRole.ACCOUNTANT]: 'Accountant',
  [UserRole.VIEWER]: 'Viewer',
}

/**
 * 🎯 ROLE DESCRIPTIONS
 * What each role can do (for tooltips/help text)
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Full platform access across all organizations',
  [UserRole.ORG_ADMIN]: 'Full access within organization and all shops',
  [UserRole.SHOP_ADMIN]: 'Full access within assigned shop',
  [UserRole.MANAGER]: 'Shop operations and staff management',
  [UserRole.STAFF]: 'POS operations and customer service',
  [UserRole.ACCOUNTANT]: 'Financial reports and billing management',
  [UserRole.VIEWER]: 'Read-only access to view data',
}

/**
 * 🎯 ROLE HIERARCHY
 * Higher number = more power
 * Used for: "Can this role manage that role?"
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ORG_ADMIN]: 80,
  [UserRole.SHOP_ADMIN]: 60,
  [UserRole.MANAGER]: 40,
  [UserRole.ACCOUNTANT]: 30,
  [UserRole.STAFF]: 20,
  [UserRole.VIEWER]: 10,
}

/**
 * 🎯 ROLES THAT CAN CREATE OTHER ROLES
 * Mapping: "Who can create whom?"
 */
export const ROLE_CREATION_MATRIX: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [
    UserRole.SUPER_ADMIN,
    UserRole.ORG_ADMIN,
    UserRole.SHOP_ADMIN,
    UserRole.MANAGER,
    UserRole.ACCOUNTANT,
    UserRole.STAFF,
    UserRole.VIEWER,
  ],
  [UserRole.ORG_ADMIN]: [
    UserRole.SHOP_ADMIN,
    UserRole.MANAGER,
    UserRole.ACCOUNTANT,
    UserRole.STAFF,
    UserRole.VIEWER,
  ],
  [UserRole.SHOP_ADMIN]: [
    UserRole.MANAGER,
    UserRole.ACCOUNTANT,
    UserRole.STAFF,
    UserRole.VIEWER,
  ],
  [UserRole.MANAGER]: [UserRole.STAFF, UserRole.VIEWER],
  [UserRole.ACCOUNTANT]: [],
  [UserRole.STAFF]: [],
  [UserRole.VIEWER]: [],
}

/**
 * 🎯 ADMIN ROLES (for quick checks)
 */
export const ADMIN_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.ORG_ADMIN,
  UserRole.SHOP_ADMIN,
]

/**
 * 🎯 OPERATIONAL ROLES (day-to-day business)
 */
export const OPERATIONAL_ROLES = [
  UserRole.MANAGER,
  UserRole.STAFF,
  UserRole.ACCOUNTANT,
]

/**
 * 🎯 SHOP-LEVEL ROLES (need shop assignment)
 */
export const SHOP_LEVEL_ROLES = [
  UserRole.SHOP_ADMIN,
  UserRole.MANAGER,
  UserRole.STAFF,
  UserRole.ACCOUNTANT,
  UserRole.VIEWER,
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user is any type of admin
 * @param role - User's role
 * @returns boolean
 */
export const isAdmin = (role: UserRole): boolean => {
  return ADMIN_ROLES.includes(role)
}

/**
 * Check if user is super admin
 * @param role - User's role
 * @returns boolean
 */
export const isSuperAdmin = (role: UserRole): boolean => {
  return role === UserRole.SUPER_ADMIN
}

/**
 * Check if user is organization admin
 * @param role - User's role
 * @returns boolean
 */
export const isOrgAdmin = (role: UserRole): boolean => {
  return role === UserRole.ORG_ADMIN
}

/**
 * Check if user is shop admin
 * @param role - User's role
 * @returns boolean
 */
export const isShopAdmin = (role: UserRole): boolean => {
  return role === UserRole.SHOP_ADMIN
}

/**
 * Check if user has specific role
 * @param userRole - User's actual role
 * @param requiredRole - Role to check against
 * @returns boolean
 */
export const hasRole = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return userRole === requiredRole
}

/**
 * Check if user has any of the specified roles
 * @param userRole - User's actual role
 * @param allowedRoles - Array of allowed roles
 * @returns boolean
 */
export const hasAnyRole = (
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean => {
  return allowedRoles.includes(userRole)
}

/**
 * Check if user's role is higher than another role
 * Used for: "Can manager edit staff profile?"
 * @param userRole - User's role
 * @param targetRole - Role to compare against
 * @returns boolean
 */
export const isRoleHigher = (
  userRole: UserRole,
  targetRole: UserRole
): boolean => {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole]
}

/**
 * Check if user can create another role
 * @param userRole - User's role
 * @param targetRole - Role to be created
 * @returns boolean
 */
export const canCreateRole = (
  userRole: UserRole,
  targetRole: UserRole
): boolean => {
  return ROLE_CREATION_MATRIX[userRole]?.includes(targetRole) || false
}

/**
 * Get roles that a user can create
 * @param userRole - User's role
 * @returns Array of roles
 */
export const getAllowedRolesToCreate = (userRole: UserRole): UserRole[] => {
  return ROLE_CREATION_MATRIX[userRole] || []
}

/**
 * Check if role requires shop assignment
 * @param role - User's role
 * @returns boolean
 */
export const requiresShopAssignment = (role: UserRole): boolean => {
  return SHOP_LEVEL_ROLES.includes(role)
}

/**
 * Get role label for display
 * @param role - User's role
 * @returns string
 */
export const getRoleLabel = (role: UserRole): string => {
  return ROLE_LABELS[role] || 'Unknown Role'
}

/**
 * Get role description
 * @param role - User's role
 * @returns string
 */
export const getRoleDescription = (role: UserRole): string => {
  return ROLE_DESCRIPTIONS[role] || ''
}

/**
 * Get role badge color (for UI)
 * @param role - User's role
 * @returns Tailwind color class
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const colorMap: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
    [UserRole.ORG_ADMIN]: 'bg-blue-100 text-blue-800 border-blue-200',
    [UserRole.SHOP_ADMIN]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [UserRole.MANAGER]: 'bg-green-100 text-green-800 border-green-200',
    [UserRole.ACCOUNTANT]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [UserRole.STAFF]: 'bg-gray-100 text-gray-800 border-gray-200',
    [UserRole.VIEWER]: 'bg-slate-100 text-slate-800 border-slate-200',
  }

  return colorMap[role] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Convert role string to UserRole enum (with validation)
 * @param roleString - Role as string
 * @returns UserRole or null
 */
export const parseRole = (roleString: string): UserRole | null => {
  const normalizedRole = roleString.toLowerCase()
  const roleValues = Object.values(UserRole)

  if (roleValues.includes(normalizedRole as UserRole)) {
    return normalizedRole as UserRole
  }

  return null
}

/**
 * Get all roles as array (for dropdowns)
 * @returns Array of roles
 */
export const getAllRoles = (): UserRole[] => {
  return Object.values(UserRole)
}

/**
 * Get all roles with labels (for select options)
 * @returns Array of {value, label}
 */
export const getRoleOptions = () => {
  return getAllRoles().map(role => ({
    value: role,
    label: ROLE_LABELS[role],
  }))
}

/**
 * Get allowed role options for a user (for user creation form)
 * @param userRole - Current user's role
 * @returns Array of {value, label}
 */
export const getAllowedRoleOptions = (userRole: UserRole) => {
  const allowedRoles = getAllowedRolesToCreate(userRole)
  return allowedRoles.map(role => ({
    value: role,
    label: ROLE_LABELS[role],
    description: ROLE_DESCRIPTIONS[role],
  }))
}

/**
 * Validate if role is valid
 * @param role - Role to validate
 * @returns boolean
 */
export const isValidRole = (role: string): boolean => {
  return getAllRoles().includes(role as UserRole)
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  UserRole,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_HIERARCHY,
  ROLE_CREATION_MATRIX,
  ADMIN_ROLES,
  OPERATIONAL_ROLES,
  SHOP_LEVEL_ROLES,

  // Helper functions
  isAdmin,
  isSuperAdmin,
  isOrgAdmin,
  isShopAdmin,
  hasRole,
  hasAnyRole,
  isRoleHigher,
  canCreateRole,
  getAllowedRolesToCreate,
  requiresShopAssignment,
  getRoleLabel,
  getRoleDescription,
  getRoleBadgeColor,
  parseRole,
  getAllRoles,
  getRoleOptions,
  getAllowedRoleOptions,
  isValidRole,
}
