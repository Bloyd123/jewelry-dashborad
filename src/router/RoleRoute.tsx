//
// FILE: src/router/RoleRoute.tsx
// Permission-Based Route Protection - FULLY ALIGNED WITH REDUX ARCHITECTURE
//

import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Alert, AlertDescription, AlertTitle } from '@/components/common/Alert'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import type { PermissionKey, UserRole } from '@/types'

//
// TYPES & INTERFACES
//

interface RoleRouteProps {
  children: React.ReactNode

  // Permission-Based Protection
  permission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requireAll?: boolean // If true, user must have ALL permissions

  // Role-Based Protection
  requiredRole?: UserRole
  requiredRoles?: UserRole[]

  // Fallback & Error Handling
  fallbackPath?: string
  showError?: boolean
}

//
// ROLE ROUTE COMPONENT
//

export const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  permission,
  requiredPermissions = [],
  requireAll = false,
  requiredRole,
  requiredRoles = [],
  fallbackPath = ROUTE_PATHS.DASHBOARD,
  showError = true,
}) => {
  //  FIXED: Access from correct slices
  const { role: userRole } = useAppSelector(state => state.auth)
  const effectivePermissions = useAppSelector(
    state =>
      state.permissions.currentShopPermissions ||
      state.permissions.orgPermissions
  )

  //
  // ROLE-BASED CHECKS (if specified)
  //

  if (requiredRole || requiredRoles.length > 0) {
    const hasRole = requiredRole
      ? userRole === requiredRole
      : requiredRoles.includes(userRole!)

    if (!hasRole) {
      console.warn('[RoleRoute] Role check failed:', {
        userRole,
        requiredRole,
        requiredRoles,
      })

      return showError ? (
        <AccessDeniedError reason="insufficient_role" />
      ) : (
        <Navigate to={fallbackPath} replace />
      )
    }
  }

  //
  // PERMISSION-BASED CHECKS
  //

  // If no permissions specified, allow access (role check already passed if any)
  if (!permission && requiredPermissions.length === 0) {
    return <>{children}</>
  }

  // Check if permissions are loaded
  if (!effectivePermissions) {
    console.warn('[RoleRoute] No permissions loaded for user:', userRole)
    return showError ? (
      <AccessDeniedError reason="no_permissions" />
    ) : (
      <Navigate to={fallbackPath} replace />
    )
  }

  // Check single permission
  if (permission) {
    const hasPermission = effectivePermissions[permission] === true

    if (!hasPermission) {
      console.warn(`[RoleRoute] Permission denied: ${permission}`, {
        role: userRole,
        hasPermission,
      })

      return showError ? (
        <AccessDeniedError
          reason="missing_permission"
          permission={permission}
        />
      ) : (
        <Navigate to={fallbackPath} replace />
      )
    }
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0) {
    const checkPermissions = requireAll
      ? requiredPermissions.every(perm => effectivePermissions[perm] === true)
      : requiredPermissions.some(perm => effectivePermissions[perm] === true)

    if (!checkPermissions) {
      console.warn('[RoleRoute] Multiple permissions check failed:', {
        required: requiredPermissions,
        requireAll,
        role: userRole,
      })

      return showError ? (
        <AccessDeniedError
          reason="missing_permissions"
          permissions={requiredPermissions}
          requireAll={requireAll}
        />
      ) : (
        <Navigate to={fallbackPath} replace />
      )
    }
  }

  return <>{children}</>
}

//
// ACCESS DENIED ERROR COMPONENT
//

interface AccessDeniedErrorProps {
  reason?:
    | 'insufficient_role'
    | 'no_permissions'
    | 'missing_permission'
    | 'missing_permissions'
  permission?: PermissionKey
  permissions?: PermissionKey[]
  requireAll?: boolean
}

const AccessDeniedError: React.FC<AccessDeniedErrorProps> = ({
  reason = 'missing_permission',
  permission,
  permissions,
  requireAll,
}) => {
  const { t } = useTranslation()

  const handleGoBack = () => {
    window.history.back()
  }

  const getErrorMessage = () => {
    switch (reason) {
      case 'insufficient_role':
        return t('authAlert.accessDenied.insufficientRole')
      case 'no_permissions':
        return t('authAlert.accessDenied.noPermissions')
      case 'missing_permission':
        return t('authAlert.accessDenied.missingPermission', { permission })
      case 'missing_permissions':
        return requireAll
          ? t('authAlert.accessDenied.missingAllPermissions', {
              count: permissions?.length,
            })
          : t('authAlert.accessDenied.missingAnyPermission', {
              count: permissions?.length,
            })
      default:
        return t('authAlert.accessDenied.description')
    }
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
            {getErrorMessage()}
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

//
// EXPORT TYPES
//

export type { RoleRouteProps }
