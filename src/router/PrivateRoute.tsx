// FILE: src/router/PrivateRoute.tsx
// Protected Route Wrapper - Handles Authentication

import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/loader/Spinner'

interface PrivateRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = ROUTE_PATHS.AUTH.LOGIN,
}) => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)

  // Show loading state while checking authentication
  if (isLoading) {
    return <Spinner />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Render protected content with Suspense for lazy loading
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

// Public Route - Redirects authenticated users away from auth pages

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = ROUTE_PATHS.DASHBOARD,
}) => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth)

  // Show loading state
  if (isLoading) {
    return <Spinner />
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Render public content
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}
