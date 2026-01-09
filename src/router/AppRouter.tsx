// FILE: src/router/AppRouter.tsx
// Main Application Router

import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from './PrivateRoute'
import { RoleRoute } from './RoleRoute'
import { MainLayout } from '@/components/layout/MainLayout/MainLayout'
import {
  publicRoutes,
  protectedRoutes,
  RouteConfig,
} from '@/config/routes.config'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/loader/Spinner'

// Route Renderer - Handles individual route rendering with permissions

const RouteRenderer: React.FC<{ route: RouteConfig }> = ({ route }) => {
  const Element = route.element

  return (
    <Suspense fallback={<Spinner />}>
      {route.permission || route.requiredPermissions ? (
        <RoleRoute
          permission={route.permission}
          requiredPermissions={route.requiredPermissions}
        >
          <Element />
        </RoleRoute>
      ) : (
        <Element />
      )}
    </Suspense>
  )
}

// Main App Router

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route
        path="/"
        element={<Navigate to={ROUTE_PATHS.AUTH.LOGIN} replace />}
      />

      {/* Public Routes (Auth pages) */}
      {publicRoutes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PublicRoute>
              <RouteRenderer route={route} />
            </PublicRoute>
          }
        />
      ))}

      {/* Protected Routes with Layout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard redirect */}
        <Route
          index
          element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />}
        />

        {/* Protected Routes */}
        {protectedRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteRenderer route={route} />}
          />
        ))}

        {/* Catch all - redirect to dashboard */}
        <Route
          path="*"
          element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />}
        />
      </Route>
    </Routes>
  )
}
