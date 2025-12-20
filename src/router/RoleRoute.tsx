// ============================================================================
// FILE: router/RoleRoute.tsx
// Permission-Based Route Component - Uses Centralized Permissions Config
// ============================================================================
import { Navigate, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import { ROUTES } from '../config/routes.config'
import { getPermissionsByRole } from '../config/permissions.config'
import { Button } from '../components/ui/button'
import { UserRole } from '@/types'

interface RoleRouteProps {
  // Option 1: Check by roles
  allowedRoles?: UserRole[]

  // Option 2: Check by specific permissions (more flexible)
  requiredPermissions?: Permission[]

  // Require ALL permissions or just ANY permission
  requireAll?: boolean

  // Custom redirect path
  redirectTo?: string

  // Show custom message
  customMessage?: string
}

// ============================================================================
// ROLE ROUTE COMPONENT
// ============================================================================
const RoleRoute = ({
  allowedRoles,
  requiredPermissions,
  requireAll = false,
  //   redirectTo = ROUTES.dashboard,
  customMessage,
}: RoleRouteProps) => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  // ========================================
  // Check Authentication First
  // ========================================
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.login} replace />
  }

  // ========================================
  // Get User Permissions
  // ========================================
  const userRole = user.role as UserRole
  const userPermissions = getPermissionsByRole(userRole)

  // ========================================
  // Check Access by Role
  // ========================================
  let hasAccess = false

  if (allowedRoles && allowedRoles.length > 0) {
    hasAccess = allowedRoles.includes(userRole)
  }

  // ========================================
  // Check Access by Permissions (more granular)
  // ========================================
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      // User must have ALL required permissions
      hasAccess = requiredPermissions.every(
        permission => userPermissions[permission] === true
      )
    } else {
      // User must have at least ONE required permission
      hasAccess = requiredPermissions.some(
        permission => userPermissions[permission] === true
      )
    }
  }

  // ========================================
  // Show Access Denied UI
  // ========================================
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="max-w-md rounded-lg border border-border-primary bg-bg-secondary p-8 text-center shadow-lg">
          {/* Icon */}
          <div className="mb-4">
            <AlertTriangle className="mx-auto h-16 w-16 text-status-error" />
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-bold text-text-primary">
            {t('permissions.accessDenied.title')}
          </h2>

          {/* Message */}
          <p className="mb-2 text-text-secondary">
            {customMessage || t('permissions.accessDenied.message')}
          </p>

          {/* User Role Info */}
          <p className="mb-6 text-sm text-text-tertiary">
            {t('permissions.accessDenied.yourRole')}:{' '}
            <span className="font-semibold capitalize text-accent">
              {t(`roles.${userRole}`)}
            </span>
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => window.history.back()}>
              {t('permissions.accessDenied.goBack')}
            </Button>
            <Button
              variant="default"
              onClick={() => (window.location.href = ROUTES.dashboard)}
            >
              {t('permissions.accessDenied.goToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ========================================
  // Render Protected Content
  // ========================================
  return <Outlet />
}

export default RoleRoute
