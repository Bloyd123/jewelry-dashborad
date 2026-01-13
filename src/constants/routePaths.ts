// FILE: src/constants/routePaths.ts
// Centralized Route Path Constants

export const ROUTE_PATHS = {
  // Auth Routes
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
        VERIFY_EMAIL: '/verify-email',
    RESEND_VERIFICATION: '/resend-verification',
    VERIFICATION_SUCCESS: '/verification-success',
  },

  // Core Routes
  DASHBOARD: '/dashboard',

  // Customer Routes
  CUSTOMERS: {
    ROOT: '/customers',
    LIST: '/customers',
    ADD: '/customers/add',
    EDIT: '/customers/edit/:customerId',
    DETAIL: '/customers/:id',
  },
  USERS: {
    ADD: '/users/add',
    LIST: '/users',
    EDIT: '/users/edit/:id',
  },
  // Shop Routes
  SHOPS: {
    ROOT: '/shops',
    LIST: '/shops',
    ADD: '/shops/add',
    EDIT: '/shops/edit/:shopId',
    DETAIL: '/shops/:id',
  },

  // Product Routes
  PRODUCTS: {
    ROOT: '/products',
    LIST: '/products',
    ADD: '/products/add',
    EDIT: '/products/edit/:productId',
    DETAIL: '/products/:id',
  },

  // Supplier Routes
  SUPPLIERS: {
    ROOT: '/suppliers',
    LIST: '/suppliers',
    ADD: '/suppliers/add',
    EDIT: '/suppliers/edit/:supplierId',
    DETAIL: '/suppliers/:id',
  },

  // Purchase Routes
  PURCHASES: {
    ROOT: '/purchases',
    LIST: '/purchases',
    ADD: '/purchases/add',
    EDIT: '/purchases/edit/:purchaseId',
    DETAIL: '/purchases/:id',
  },

  // Sales Routes
  SALES: {
    ROOT: '/sales',
    LIST: '/sales',
    ADD: '/sales/add',
    EDIT: '/sales/edit/:saleId',
    DETAIL: '/sales/:id',
  },

  // Payment Routes
  PAYMENTS: {
    ROOT: '/payments',
    LIST: '/payments',
    ADD: '/payments/add',
    EDIT: '/payments/edit/:paymentId',
    DETAIL: '/payments/:id',
  },

  // Order Routes
  ORDERS: {
    ROOT: '/orders',
    LIST: '/orders',
    ADD: '/orders/add',
    EDIT: '/orders/edit/:orderId',
    DETAIL: '/orders/:id',
  },

  // Metal Rates
  METAL_RATES: '/metal-rates',

  // User Profile
  USER_PROFILE: '/userprofile',

  // Catch All
  NOT_FOUND: '*',
} as const

// Route Builder Utilities

export const buildRoute = {
  customer: {
    detail: (id: string) => `/customers/${id}`,
    edit: (id: string) => `/customers/edit/${id}`,
  },
  shop: {
    detail: (id: string) => `/shops/${id}`,
    edit: (id: string) => `/shops/edit/${id}`,
  },
  product: {
    detail: (id: string) => `/products/${id}`,
    edit: (id: string) => `/products/edit/${id}`,
  },
  supplier: {
    detail: (id: string) => `/suppliers/${id}`,
    edit: (id: string) => `/suppliers/edit/${id}`,
  },
  purchase: {
    detail: (id: string) => `/purchases/${id}`,
    edit: (id: string) => `/purchases/edit/${id}`,
  },
  sale: {
    detail: (id: string) => `/sales/${id}`,
    edit: (id: string) => `/sales/edit/${id}`,
  },
  payment: {
    detail: (id: string) => `/payments/${id}`,
    edit: (id: string) => `/payments/edit/${id}`,
  },
  order: {
    detail: (id: string) => `/orders/${id}`,
    edit: (id: string) => `/orders/edit/${id}`,
  },
}

// Route Metadata Types

export interface RouteMetadata {
  path: string
  permission?: string
  requiredPermissions?: string[]
  requiresAuth?: boolean
  title?: string
  layout?: 'main' | 'auth' | 'minimal'
}
