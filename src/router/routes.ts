// ============================================================================
// FILE: router/routes.ts
// Route Types, Metadata, and Helper Functions
// ============================================================================
import { ROUTES } from '../config/routes.config'
import { UserRole } from '@/types'

// ============================================================================
// TYPES
// ============================================================================
export interface RouteMetadata {
  path: string
  title: string
  requiresAuth: boolean
  allowedRoles?: UserRole[]
  icon?: string
  showInNav?: boolean
  parent?: string
}

// ============================================================================
// ROUTE METADATA CONFIGURATION
// ============================================================================
export const routeMetadata: Record<string, RouteMetadata> = {
  // ========================================
  // Auth Routes
  // ========================================
  login: {
    path: ROUTES.login,
    title: 'Login',
    requiresAuth: false,
    showInNav: false,
  },
  signup: {
    path: ROUTES.signup,
    title: 'Sign Up',
    requiresAuth: false,
    showInNav: false,
  },
  forgotPassword: {
    path: ROUTES.forgotPassword,
    title: 'Forgot Password',
    requiresAuth: false,
    showInNav: false,
  },
  resetPassword: {
    path: ROUTES.resetPassword,
    title: 'Reset Password',
    requiresAuth: false,
    showInNav: false,
  },

  // ========================================
  // Main Routes
  // ========================================
  dashboard: {
    path: ROUTES.dashboard,
    title: 'Dashboard',
    requiresAuth: true,
    showInNav: true,
    icon: 'dashboard',
  },
  stock: {
    path: ROUTES.stock,
    title: 'Stock Management',
    requiresAuth: true,
    showInNav: true,
    icon: 'inventory',
  },

  // ========================================
  // Payment Routes
  // ========================================
  payments: {
    path: ROUTES.payments,
    title: 'Payments',
    requiresAuth: true,
    showInNav: true,
    icon: 'payment',
  },
  paymentHistory: {
    path: ROUTES.paymentHistory,
    title: 'Payment History',
    requiresAuth: true,
    showInNav: false,
    parent: 'payments',
  },
  paymentEntry: {
    path: ROUTES.paymentEntry,
    title: 'Payment Entry',
    requiresAuth: true,
    showInNav: false,
    parent: 'payments',
  },

  // ========================================
  // Purchase Routes
  // ========================================
  purchases: {
    path: ROUTES.purchases,
    title: 'Purchases',
    requiresAuth: true,
    showInNav: true,
    icon: 'shopping_cart',
  },
  addPurchase: {
    path: ROUTES.addPurchase,
    title: 'Add Purchase',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager', 'staff'],
    showInNav: false,
    parent: 'purchases',
  },
  suppliers: {
    path: ROUTES.suppliers,
    title: 'Suppliers',
    requiresAuth: true,
    showInNav: true,
    icon: 'business',
  },
  purchaseReports: {
    path: ROUTES.purchaseReports,
    title: 'Purchase Reports',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager'],
    showInNav: false,
    parent: 'purchases',
  },

  // ========================================
  // Sales Routes
  // ========================================
  sales: {
    path: ROUTES.sales,
    title: 'Sales',
    requiresAuth: true,
    showInNav: true,
    icon: 'point_of_sale',
  },
  addSale: {
    path: ROUTES.addSale,
    title: 'Add Sale',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager', 'staff'],
    showInNav: false,
    parent: 'sales',
  },
  customers: {
    path: ROUTES.customers,
    title: 'Customers',
    requiresAuth: true,
    showInNav: true,
    icon: 'people',
  },
  salesReports: {
    path: ROUTES.salesReports,
    title: 'Sales Reports',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager'],
    showInNav: false,
    parent: 'sales',
  },

  // ========================================
  // Old Gold Routes
  // ========================================
  oldGoldPurchases: {
    path: ROUTES.oldGoldPurchases,
    title: 'Old Gold Purchases',
    requiresAuth: true,
    showInNav: true,
    icon: 'monetization_on',
  },
  addOldGoldPurchase: {
    path: ROUTES.addOldGoldPurchase,
    title: 'Add Old Gold Purchase',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager', 'staff'],
    showInNav: false,
    parent: 'oldGoldPurchases',
  },

  // ========================================
  // Product Routes
  // ========================================
  products: {
    path: ROUTES.products,
    title: 'Products',
    requiresAuth: true,
    showInNav: true,
    icon: 'category',
  },
  addProduct: {
    path: ROUTES.addProduct,
    title: 'Add Product',
    requiresAuth: true,
    allowedRoles: ['org_admin', 'manager', 'staff'],
    showInNav: false,
    parent: 'products',
  },

  // ========================================
  // Custom Orders
  // ========================================
  customOrders: {
    path: ROUTES.customOrders,
    title: 'Custom Orders',
    requiresAuth: true,
    showInNav: true,
    icon: 'build',
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get route metadata by path
 */
export const getRouteMetadata = (path: string): RouteMetadata | undefined => {
  return Object.values(routeMetadata).find(route => route.path === path)
}

/**
 * Get navigation routes (routes that should show in nav)
 */
export const getNavRoutes = (userRole?: UserRole): RouteMetadata[] => {
  return Object.values(routeMetadata).filter(route => {
    if (!route.showInNav) return false
    if (!route.allowedRoles) return true
    if (!userRole) return false
    return route.allowedRoles.includes(userRole)
  })
}

/**
 * Check if user has access to route
 */
export const canAccessRoute = (
  routePath: string,
  userRole?: UserRole
): boolean => {
  const route = getRouteMetadata(routePath)
  if (!route) return false
  if (!route.allowedRoles) return true
  if (!userRole) return false
  return route.allowedRoles.includes(userRole)
}

/**
 * Get breadcrumb trail for a route
 */
export const getBreadcrumbs = (path: string): RouteMetadata[] => {
  const breadcrumbs: RouteMetadata[] = []
  let currentRoute = getRouteMetadata(path)

  while (currentRoute) {
    breadcrumbs.unshift(currentRoute)
    if (currentRoute.parent) {
      currentRoute = routeMetadata[currentRoute.parent]
    } else {
      break
    }
  }

  return breadcrumbs
}

// ============================================================================
// ROUTE GROUPS FOR NAVIGATION
// ============================================================================
export const routeGroups = {
  main: ['dashboard', 'stock'],
  transactions: ['purchases', 'sales', 'oldGoldPurchases', 'payments'],
  management: ['products', 'customers', 'suppliers'],
  orders: ['customOrders'],
} as const

export type RouteGroup = keyof typeof routeGroups
