// FILE: src/router/index.ts
// Central Export Point for Router

export { AppRouter } from './AppRouter'
export { PrivateRoute, PublicRoute } from './PrivateRoute'
export { RoleRoute} from './RoleRoute'

// Re-export route constants for convenience
export { ROUTE_PATHS, buildRoute } from '@/constants/routePaths'
export { ROUTES } from '@/config/routes.config'
