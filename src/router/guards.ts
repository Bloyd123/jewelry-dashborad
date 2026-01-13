// FILE: src/router/guards.ts
// Navigation Guards and Route Utilities - FIXED VERSION

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'

// Route Guard Hook - Programmatic route protection

interface RouteGuardOptions {
  permission?: string
  requiredPermissions?: string[]
  requireAll?: boolean
  redirectTo?: string
  onAccessDenied?: () => void
}

export const useRouteGuard = (options: RouteGuardOptions) => {
  const navigate = useNavigate()
  const location = useLocation()
  // FIXED: Access correct state properties
  const { permissions, isAuthenticated } = useAppSelector(state => state.auth)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate(ROUTE_PATHS.AUTH.LOGIN, {
        state: { from: location },
        replace: true,
      })
      return
    }

    // Check permissions if specified
    if (options.permission || options.requiredPermissions) {
      const hasAccess = checkPermissions(
        permissions,
        options.permission,
        options.requiredPermissions,
        options.requireAll
      )

      if (!hasAccess) {
        options.onAccessDenied?.()
        navigate(options.redirectTo || ROUTE_PATHS.DASHBOARD, { replace: true })
      }
    }
  }, [isAuthenticated, permissions, location.pathname])
}

// Permission Checker Utility - FIXED

export const checkPermissions = (
  permissions: any,
  permission?: string,
  requiredPermissions?: string[],
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

// Navigation Helper with Permission Check - FIXED

interface NavigateWithPermissionOptions {
  permission?: string
  requiredPermissions?: string[]
  requireAll?: boolean
  fallback?: string
}

export const useNavigateWithPermission = () => {
  const navigate = useNavigate()
  // FIXED: Access correct state property
  const { permissions } = useAppSelector(state => state.auth)

  const navigateWithPermission = (
    path: string,
    options?: NavigateWithPermissionOptions
  ) => {
    if (!options?.permission && !options?.requiredPermissions) {
      navigate(path)
      return
    }

    const hasAccess = checkPermissions(
      permissions,
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

// Breadcrumb Generator

export interface Breadcrumb {
  label: string
  path?: string
  isActive?: boolean
}

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

// Route Title Hook

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
