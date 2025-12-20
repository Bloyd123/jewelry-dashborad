// ============================================================================
// FILE: router/PrivateRoute.tsx
// Protected Route Component - Requires Authentication
// ============================================================================
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../store/hooks'
import { ROUTES } from '../config/routes.config'
import { Loader } from '@/components/ui/loader'

// ============================================================================
// TYPES
// ============================================================================
interface PrivateRouteProps {
  redirectTo?: string
}

// ============================================================================
// PRIVATE ROUTE COMPONENT
// ============================================================================
const PrivateRoute = ({ redirectTo = ROUTES.login }: PrivateRouteProps) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)

  // ========================================
  // Show Loading State
  // ========================================
  if (isLoading) {
    return (
      <Loader
        fullScreen
        size="lg"
        variant="spinner"
        text={t('auth.loading')}
        color="accent"
      />
    )
  }

  // ========================================
  // Check Authentication
  // ========================================
  if (!isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // ========================================
  // Render Protected Content
  // ========================================
  return <Outlet />
}

export default PrivateRoute
