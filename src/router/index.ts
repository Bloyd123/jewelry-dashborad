// ============================================================================
// FILE: router/index.ts
// Central Export File for Router Module
// ============================================================================

export { default as AppRouter } from './AppRouter'
export { default as PrivateRoute } from './PrivateRoute'
export { default as RoleRoute } from './RoleRoute'
export type { UserRole } from '@/types'

export {
  routeMetadata,
  routeGroups,
  getRouteMetadata,
  getNavRoutes,
  canAccessRoute,
  getBreadcrumbs,
} from './routes'

export type { RouteMetadata, RouteGroup } from './routes'