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
  bugReport: '/bug-report',
BUG_REPORT: '/bug-report',
  // Customer Routes
  CUSTOMERS: {
    ROOT: '/customers',
    LIST: '/customers',
    ADD: '/customers/add',
    EDIT: '/customers/edit/:customerId',
    DETAIL: '/customers/:customerId',
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
    DETAIL: '/shops/:shopId',
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
    DETAIL: '/suppliers/:supplierId',
  },

  // Purchase Routes
  PURCHASES: {
    ROOT: '/purchases',
    LIST: '/purchases',
    ADD: '/purchases/add',
    EDIT: '/purchases/edit/:purchaseId',
  DETAIL: '/purchases/:purchaseId',
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
OPENING_BALANCE: '/opening-balance',
GIRVI: {
  ROOT: '/shops/:shopId/girvi',
  LIST: '/shops/:shopId/girvi',
  ADD: '/shops/:shopId/girvi/new',
  EDIT: '/shops/:shopId/girvi/edit/:girviId',
  DETAIL: '/shops/:shopId/girvi/:girviId',
  RELEASE: '/shops/:shopId/girvi/:girviId/release',
    PARTIAL_RELEASE: '/shops/:shopId/girvi/:girviId/partial-release', 
  RENEW: '/shops/:shopId/girvi/:girviId/renew',                     
  PAYMENTS: '/shops/:shopId/girvi/:girviId/payments',
  SHOP_PAYMENTS: '/shops/:shopId/girvi-payments',
},
GIRVI_TRANSFER: {
  LIST:           '/shops/:shopId/girvi/:girviId/transfers',
  ADD:            '/shops/:shopId/girvi-transfers/new',           // sidebar ke liye — bina girviId
  ADD_FOR_GIRVI:  '/shops/:shopId/girvi/:girviId/transfers/new',  // table action ke liye — girviId ke saath
  DETAIL:         '/shops/:shopId/girvi/:girviId/transfers/:transferId',
},
GIRVI_CASHBOOK: '/shops/:shopId/girvi-cashbook',
  // User Profile
  USER_PROFILE: '/userprofile',

  // Catch All
  NOT_FOUND: '*',
} as const

// Route Builder Utilities

export const buildRoute = {
girviTransfer: {
  list:         (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/transfers`,
  add:          (shopId: string) => `/shops/${shopId}/girvi-transfers/new`,                                    // sidebar
  addForGirvi:  (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/transfers/new`,        // table action
detail: (shopId: string, girviId: string, transferId: string) => `/shops/${shopId}/girvi/${girviId}/transfers/${transferId}`,
},
girviCashbook: (shopId: string) => `/shops/${shopId}/girvi-cashbook`,
girvi: {
  list:          (shopId: string) => `/shops/${shopId}/girvi`,
  detail:        (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}`,
  edit:          (shopId: string, girviId: string) => `/shops/${shopId}/girvi/edit/${girviId}`,
  release:       (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/release`,
  partialRelease:(shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/partial-release`, // NEW
  renew:         (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/renew`,           // NEW
  add:           (shopId: string) => `/shops/${shopId}/girvi/new`,
  payments:      (shopId: string, girviId: string) => `/shops/${shopId}/girvi/${girviId}/payments`,
  shopPayments:  (shopId: string) => `/shops/${shopId}/girvi-payments`,
},
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
