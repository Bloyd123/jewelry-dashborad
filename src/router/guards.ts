//
// FILE: src/router/guards.ts
// Navigation Guards and Route Utilities - FULLY ALIGNED
//

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'
import type { PermissionKey, UserRole } from '@/types'

//
// TYPES
//

interface RouteGuardOptions {
  permission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requireAll?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  redirectTo?: string
  onAccessDenied?: () => void
}

interface NavigateWithPermissionOptions {
  permission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requireAll?: boolean
  fallback?: string
}

export interface Breadcrumb {
  label: string
  path?: string
  isActive?: boolean
}

//
// ROUTE GUARD HOOK - Programmatic route protection
//

export const useRouteGuard = (options: RouteGuardOptions) => {
  const navigate = useNavigate()
  const location = useLocation()

  //  Access from correct slices
  const { isAuthenticated, role } = useAppSelector(state => state.auth)
  const effectivePermissions = useAppSelector(
    state =>
      state.permissions.currentShopPermissions ||
      state.permissions.orgPermissions
  )

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate(ROUTE_PATHS.AUTH.LOGIN, {
        state: { from: location },
        replace: true,
      })
      return
    }

    // Check role if specified
    if (options.requiredRole || options.requiredRoles) {
      const hasRole = options.requiredRole
        ? role === options.requiredRole
        : options.requiredRoles?.includes(role!)

      if (!hasRole) {
        options.onAccessDenied?.()
        navigate(options.redirectTo || ROUTE_PATHS.DASHBOARD, { replace: true })
        return
      }
    }

    // Check permissions if specified
    if (options.permission || options.requiredPermissions) {
      const hasAccess = checkPermissions(
        effectivePermissions,
        options.permission,
        options.requiredPermissions,
        options.requireAll
      )

      if (!hasAccess) {
        options.onAccessDenied?.()
        navigate(options.redirectTo || ROUTE_PATHS.DASHBOARD, { replace: true })
      }
    }
  }, [isAuthenticated, effectivePermissions, role, location.pathname])
}

//
// PERMISSION CHECKER UTILITY
//

export const checkPermissions = (
  permissions: Record<string, boolean> | null,
  permission?: PermissionKey,
  requiredPermissions?: PermissionKey[],
  requireAll = false
): boolean => {
  if (!permissions) return false

  // Check single permission
  if (permission) {
    return permissions[permission] === true
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      return requiredPermissions.every(perm => permissions[perm] === true)
    } else {
      return requiredPermissions.some(perm => permissions[perm] === true)
    }
  }

  return true
}

//
// NAVIGATION WITH PERMISSION CHECK
//

export const useNavigateWithPermission = () => {
  const navigate = useNavigate()

  //  Access from permissions slice
  const effectivePermissions = useAppSelector(
    state =>
      state.permissions.currentShopPermissions ||
      state.permissions.orgPermissions
  )

  const navigateWithPermission = (
    path: string,
    options?: NavigateWithPermissionOptions
  ) => {
    if (!options?.permission && !options?.requiredPermissions) {
      navigate(path)
      return
    }

    const hasAccess = checkPermissions(
      effectivePermissions,
      options.permission,
      options.requiredPermissions,
      options.requireAll
    )

    if (hasAccess) {
      navigate(path)
    } else {
      navigate(options.fallback || ROUTE_PATHS.DASHBOARD)
    }
  }

  return { navigateWithPermission }
}

//
// ROLE CHECKER UTILITY
//

export const checkRole = (
  userRole: UserRole | null,
  requiredRole?: UserRole,
  requiredRoles?: UserRole[]
): boolean => {
  if (!userRole) return false

  if (requiredRole) {
    return userRole === requiredRole
  }

  if (requiredRoles && requiredRoles.length > 0) {
    return requiredRoles.includes(userRole)
  }

  return true
}

//
// NAVIGATION WITH ROLE CHECK
//

export const useNavigateWithRole = () => {
  const navigate = useNavigate()
  const { role } = useAppSelector(state => state.auth)

  const navigateWithRole = (
    path: string,
    requiredRole?: UserRole,
    requiredRoles?: UserRole[],
    fallback: string = ROUTE_PATHS.DASHBOARD
  ) => {
    if (!requiredRole && !requiredRoles) {
      navigate(path)
      return
    }

    const hasAccess = checkRole(role, requiredRole, requiredRoles)

    if (hasAccess) {
      navigate(path)
    } else {
      navigate(fallback)
    }
  }

  return { navigateWithRole }
}

//
// BREADCRUMB GENERATOR
//

export const generateBreadcrumbs = (pathname: string): Breadcrumb[] => {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', path: ROUTE_PATHS.DASHBOARD },
  ]

  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const isLast = index === paths.length - 1

    // Format label (capitalize and replace hyphens)
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      label,
      path: isLast ? undefined : currentPath,
      isActive: isLast,
    })
  })

  return breadcrumbs
}

//
// ROUTE TITLE HOOK
//

export const useRouteTitle = (title?: string) => {
  const location = useLocation()

  useEffect(() => {
    if (title) {
      document.title = `${title} | Jewelry Management`
    } else {
      // Generate title from path
      const pathTitle = location.pathname
        .split('/')
        .filter(Boolean)
        .pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      document.title = pathTitle
        ? `${pathTitle} | Jewelry Management`
        : 'Jewelry Management System'
    }
  }, [title, location.pathname])
}

//
// SHOP CONTEXT GUARD
//

export const useShopContextGuard = (
  redirectTo: string = ROUTE_PATHS.DASHBOARD
) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { currentShopId, role } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Skip for org-level users
    if (role === 'super_admin' || role === 'org_admin') {
      return
    }

    // Shop-level users must have a current shop
    if (!currentShopId) {
      navigate(redirectTo, {
        state: { from: location },
        replace: true,
      })
    }
  }, [currentShopId, role, location.pathname])
}

//
// EMAIL VERIFICATION GUARD
//

export const useEmailVerificationGuard = (
  redirectTo: string = ROUTE_PATHS.AUTH.VERIFY_EMAIL
) => {
  const navigate = useNavigate()
  const location = useLocation()

  const userProfile = useAppSelector(state => state.user.profile)

  useEffect(() => {
    if (userProfile && !userProfile.isEmailVerified) {
      navigate(redirectTo, {
        state: { from: location },
        replace: true,
      })
    }
  }, [userProfile?.isEmailVerified, location.pathname])
}

//
// COMBINED ACCESS CHECK
//

interface AccessCheckOptions {
  permission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requireAll?: boolean
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
}

export const useAccessCheck = (options: AccessCheckOptions) => {
  const { role } = useAppSelector(state => state.auth)
  const effectivePermissions = useAppSelector(
    state =>
      state.permissions.currentShopPermissions ||
      state.permissions.orgPermissions
  )

  const hasRoleAccess = checkRole(
    role,
    options.requiredRole,
    options.requiredRoles
  )

  const hasPermissionAccess = checkPermissions(
    effectivePermissions,
    options.permission,
    options.requiredPermissions,
    options.requireAll
  )

  const hasAccess = hasRoleAccess && hasPermissionAccess

  return {
    hasAccess,
    hasRoleAccess,
    hasPermissionAccess,
    role,
    permissions: effectivePermissions,
  }
}

//
// EXPORTS
//

export type { RouteGuardOptions, NavigateWithPermissionOptions }
