import { useAppSelector } from '@/store/hooks'
import { getPermissionsByRole } from '@/config/permissions.config'
import { UserRole, Permission } from '@/types'

export const usePermissions = () => {
  const { user } = useAppSelector(state => state.auth)

  if (!user) {
    return {
      permissions: {},
      userRole: null,
      hasPermission: () => false,
      hasRole: () => false,
      hasAnyRole: () => false,
      hasAnyPermission: () => false,
      hasAllPermissions: () => false,
    }
  }

  const userRole = user.role as UserRole
  const permissions = getPermissionsByRole(userRole)

  return {
    permissions,
    userRole,

    /**
     * Check if user has a specific permission
     * @param permission - Permission key to check
     * @returns true if user has the permission
     */
    hasPermission: (permission: Permission): boolean => {
      return permissions[permission] === true
    },

    /**
     * Check if user has a specific role
     * @param role - Role to check
     * @returns true if user has the role
     */
    hasRole: (role: UserRole): boolean => {
      return userRole === role
    },

    /**
     * Check if user has any of the specified roles
     * @param roles - Array of roles to check
     * @returns true if user has at least one role
     */
    hasAnyRole: (roles: UserRole[]): boolean => {
      return roles.includes(userRole)
    },

    /**
     * Check if user has at least one of the specified permissions
     * @param permissionList - Array of permissions to check
     * @returns true if user has at least one permission
     */
    hasAnyPermission: (permissionList: Permission[]): boolean => {
      return permissionList.some(permission => permissions[permission] === true)
    },

    /**
     * Check if user has all of the specified permissions
     * @param permissionList - Array of permissions to check
     * @returns true if user has all permissions
     */
    hasAllPermissions: (permissionList: Permission[]): boolean => {
      return permissionList.every(
        permission => permissions[permission] === true
      )
    },
  }
}
