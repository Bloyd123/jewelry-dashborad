// FILE: src/router/RoleRoute.tsx
// Permission-Based Route Protection - FIXED VERSION

import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Alert, AlertDescription, AlertTitle } from '@/components/common/Alert'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

// TYPES & INTERFACES

interface RoleRouteProps {
  children: React.ReactNode
  permission?: string
  requiredPermissions?: string[]
  requireAll?: boolean
  fallbackPath?: string
  showError?: boolean
}

// ROLE ROUTE COMPONENT

export const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  permission,
  requiredPermissions = [],
  requireAll = false,
  fallbackPath = ROUTE_PATHS.DASHBOARD,
  showError = true,
}) => {
  // ✅ FIXED: Access correct state properties
  const { permissions, user } = useAppSelector(state => state.auth)

  // If no permissions specified, allow access
  if (!permission && requiredPermissions.length === 0) {
    return <>{children}</>
  }

  // ✅ FIXED: Check if permissions object exists
  if (!permissions) {
    console.warn('[RoleRoute] No permissions found for user:', user?.role)
    return showError ? (
      <AccessDeniedError />
    ) : (
      <Navigate to={fallbackPath} replace />
    )
  }

  // Check single permission
  if (permission) {
    const hasPermission = permissions[permission] === true

    if (!hasPermission) {
      console.warn(`[RoleRoute] Permission denied: ${permission}`, {
        role: user?.role,
        hasPermission,
      })

      return showError ? (
        <AccessDeniedError />
      ) : (
        <Navigate to={fallbackPath} replace />
      )
    }
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0) {
    const checkPermissions = requireAll
      ? requiredPermissions.every(perm => permissions[perm] === true)
      : requiredPermissions.some(perm => permissions[perm] === true)

    if (!checkPermissions) {
      console.warn('[RoleRoute] Multiple permissions check failed:', {
        required: requiredPermissions,
        requireAll,
        role: user?.role,
      })

      return showError ? (
        <AccessDeniedError />
      ) : (
        <Navigate to={fallbackPath} replace />
      )
    }
  }

  return <>{children}</>
}

// ACCESS DENIED ERROR COMPONENT

const AccessDeniedError: React.FC = () => {
  const { t } = useTranslation()

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md">
        <Alert variant="error" size="lg" bordered shadow>
          <AlertTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            {t('authAlert.accessDenied.title')}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {t('authAlert.accessDenied.description')}
          </AlertDescription>
        </Alert>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.goBack')}
          </Button>
        </div>
      </div>
    </div>
  )
}

// PERMISSION CHECKER HOOK

export const usePermission = () => {
  // ✅ FIXED: Access correct state properties
  const { permissions, user, currentShopAccess } = useAppSelector(
    state => state.auth
  )

  const hasPermission = (permission: string): boolean => {
    return permissions?.[permission] === true
  }

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(perm => permissions?.[perm] === true)
  }

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(perm => permissions?.[perm] === true)
  }

  const getRole = (): string | null => {
    return user?.role || null
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRole,
    permissions,
    currentShopAccess,
    user,
  }
}
