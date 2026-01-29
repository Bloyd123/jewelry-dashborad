// 
// FILE: src/router/PrivateRoute.tsx
// Protected Route Wrapper - FULLY ALIGNED WITH REDUX ARCHITECTURE
// 

import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/loader/Spinner'

// 
// TYPES
// 

interface PrivateRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireEmailVerification?: boolean
}

interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
  restricted?: boolean // If true, authenticated users can't access
}

// 
// PRIVATE ROUTE - Protects authenticated-only pages
// 

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = ROUTE_PATHS.AUTH.LOGIN,
  requireEmailVerification = false,
}) => {
  const location = useLocation()
  
  //  Access from correct slices
  const { isAuthenticated, isInitializing } = useAppSelector(state => state.auth)
  const userProfile = useAppSelector(state => state.user.profile)

  // Show loading state while initializing auth
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Optional: Check email verification
  if (requireEmailVerification && userProfile && !userProfile.isEmailVerified) {
    return (
      <Navigate 
        to={ROUTE_PATHS.AUTH.VERIFY_EMAIL} 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Render protected content with Suspense for lazy loading
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

// 
// PUBLIC ROUTE - Redirects authenticated users away from auth pages
// 

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = ROUTE_PATHS.DASHBOARD,
  restricted = true,
}) => {
  //  Access from auth slice
  const { isAuthenticated, isInitializing } = useAppSelector(state => state.auth)

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // If restricted and user is authenticated, redirect away
  if (restricted && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Render public content
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

// 
// CONDITIONAL ROUTE - Shows different content based on auth status
// 

interface ConditionalRouteProps {
  authenticatedComponent: React.ReactNode
  publicComponent: React.ReactNode
}

export const ConditionalRoute: React.FC<ConditionalRouteProps> = ({
  authenticatedComponent,
  publicComponent,
}) => {
  const { isAuthenticated, isInitializing } = useAppSelector(state => state.auth)

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Suspense fallback={<Spinner />}>
      {isAuthenticated ? authenticatedComponent : publicComponent}
    </Suspense>
  )
}

// 
// LOADING ROUTE - Shows loading state while auth initializes
// 

interface LoadingRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const LoadingRoute: React.FC<LoadingRouteProps> = ({
  children,
  fallback,
}) => {
  const { isInitializing } = useAppSelector(state => state.auth)

  if (isInitializing) {
    return (
      <>
        {fallback || (
          <div className="flex h-screen items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}
      </>
    )
  }

  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

// 
// SHOP CONTEXT ROUTE - Ensures user has shop context
// 

interface ShopContextRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ShopContextRoute: React.FC<ShopContextRouteProps> = ({
  children,
  redirectTo = ROUTE_PATHS.SELECT_SHOP,
}) => {
  const location = useLocation()
  
  //  Access from correct slices
  const { isAuthenticated, currentShopId, role } = useAppSelector(state => state.auth)
  const { isInitializing } = useAppSelector(state => state.auth)

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} state={{ from: location }} replace />
  }

  // Skip shop context check for org-level users (super_admin, org_admin)
  if (role === 'super_admin' || role === 'org_admin') {
    return <Suspense fallback={<Spinner />}>{children}</Suspense>
  }

  // Shop-level users must have a current shop selected
  if (!currentShopId) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

// 
// TYPES EXPORT
// 

export type { 
  PrivateRouteProps, 
  PublicRouteProps, 
  ConditionalRouteProps,
  LoadingRouteProps,
  ShopContextRouteProps,
}