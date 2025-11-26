// ============================================================================
// FILE: src/api/endpoints.ts
// API endpoint constants organized by module
// ============================================================================

// ============================================================================
// BASE URL (imported from environment)
// ============================================================================
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================
export const AUTH_ENDPOINTS = {
  // Registration
  REGISTER_SUPER_ADMIN: '/auth/register/super-admin',
  REGISTER: '/auth/register',

  // Login & Logout
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',

  // Token Management
  REFRESH_TOKEN: '/auth/refresh-token',
  REVOKE_TOKEN: '/auth/revoke-token',

  // Password Management
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',

  // Email Verification
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',

  // Profile
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',

  // Sessions
  ACTIVE_SESSIONS: '/auth/sessions',
  REVOKE_SESSION: '/auth/sessions/:sessionId',
  REVOKE_ALL_SESSIONS: '/auth/sessions/revoke-all',
} as const;

// ============================================================================
// USER ENDPOINTS
// ============================================================================
export const USER_ENDPOINTS = {
  // Base
  BASE: '/users',
  BY_ID: '/users/:id',

  // CRUD Operations
  CREATE: '/users',
  GET_ALL: '/users',
  GET_BY_ID: '/users/:id',
  UPDATE: '/users/:id',
  DELETE: '/users/:id',
  RESTORE: '/users/:id/restore',

  // User Management
  TOGGLE_STATUS: '/users/:id/toggle-status',
  CHANGE_ROLE: '/users/:id/change-role',
  RESET_PASSWORD: '/users/:id/reset-password',

  // Bulk Operations
  BULK_DELETE: '/users/bulk-delete',
  BULK_UPDATE: '/users/bulk-update',

  // Filters
  BY_ROLE: '/users/role/:role',
  BY_ORGANIZATION: '/users/organization/:organizationId',
  BY_SHOP: '/users/shop/:shopId',
  SEARCH: '/users/search',
} as const;

// ============================================================================
// ORGANIZATION ENDPOINTS
// ============================================================================
export const ORGANIZATION_ENDPOINTS = {
  // Base
  BASE: '/organizations',
  BY_ID: '/organizations/:id',

  // CRUD Operations
  CREATE: '/organizations',
  GET_ALL: '/organizations',
  GET_BY_ID: '/organizations/:id',
  UPDATE: '/organizations/:id',
  DELETE: '/organizations/:id',

  // Organization Management
  TOGGLE_STATUS: '/organizations/:id/toggle-status',
  UPDATE_SUBSCRIPTION: '/organizations/:id/subscription',
  GET_STATS: '/organizations/:id/stats',

  // Relations
  SHOPS: '/organizations/:id/shops',
  USERS: '/organizations/:id/users',
} as const;

// ============================================================================
// SHOP ENDPOINTS
// ============================================================================
export const SHOP_ENDPOINTS = {
  // Base
  BASE: '/shops',
  BY_ID: '/shops/:id',

  // CRUD Operations
  CREATE: '/shops',
  GET_ALL: '/shops',
  GET_BY_ID: '/shops/:id',
  UPDATE: '/shops/:id',
  DELETE: '/shops/:id',
  RESTORE: '/shops/:id/restore',

  // Shop Management
  TOGGLE_STATUS: '/shops/:id/toggle-status',
  UPDATE_SETTINGS: '/shops/:id/settings',
  UPDATE_METAL_RATES: '/shops/:id/metal-rates',
  GET_STATISTICS: '/shops/:id/statistics',

  // Relations
  USERS: '/shops/:id/users',
  PRODUCTS: '/shops/:id/products',
  CUSTOMERS: '/shops/:id/customers',
  SUPPLIERS: '/shops/:id/suppliers',

  // Filters
  BY_ORGANIZATION: '/shops/organization/:organizationId',
  BY_CITY: '/shops/city/:city',
  BY_TYPE: '/shops/type/:shopType',
} as const;

// ============================================================================
// PRODUCT ENDPOINTS
// ============================================================================
export const PRODUCT_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/products',
  BY_ID: '/shops/:shopId/products/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/products',
  GET_ALL: '/shops/:shopId/products',
  GET_BY_ID: '/shops/:shopId/products/:id',
  UPDATE: '/shops/:shopId/products/:id',
  DELETE: '/shops/:shopId/products/:id',
  RESTORE: '/shops/:shopId/products/:id/restore',

  // Product Operations
  UPDATE_STOCK: '/shops/:shopId/products/:id/stock',
  RESERVE: '/shops/:shopId/products/:id/reserve',
  CANCEL_RESERVATION: '/shops/:shopId/products/:id/cancel-reservation',
  MARK_AS_SOLD: '/shops/:shopId/products/:id/mark-as-sold',
  CALCULATE_PRICE: '/shops/:shopId/products/:id/calculate-price',

  // Bulk Operations
  BULK_DELETE: '/shops/:shopId/products/bulk-delete',
  BULK_UPDATE_STATUS: '/shops/:shopId/products/bulk-update-status',
  BULK_IMPORT: '/shops/:shopId/products/import',
  EXPORT: '/shops/:shopId/products/export',

  // Filters & Search
  BY_CATEGORY: '/shops/:shopId/products/category/:category',
  BY_METAL: '/shops/:shopId/products/metal/:metalType',
  LOW_STOCK: '/shops/:shopId/products/low-stock',
  OUT_OF_STOCK: '/shops/:shopId/products/out-of-stock',
  AVAILABLE: '/shops/:shopId/products/available',
  SEARCH: '/shops/:shopId/products/search',

  // Code Generation
  GENERATE_CODE: '/shops/:shopId/products/generate-code',
} as const;

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================
export const CUSTOMER_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/customers',
  BY_ID: '/shops/:shopId/customers/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/customers',
  GET_ALL: '/shops/:shopId/customers',
  GET_BY_ID: '/shops/:shopId/customers/:id',
  UPDATE: '/shops/:shopId/customers/:id',
  DELETE: '/shops/:shopId/customers/:id',

  // Customer Operations
  TOGGLE_STATUS: '/shops/:shopId/customers/:id/toggle-status',
  ADD_NOTES: '/shops/:shopId/customers/:id/notes',
  GET_PURCHASES: '/shops/:shopId/customers/:id/purchases',
  GET_ORDERS: '/shops/:shopId/customers/:id/orders',
  GET_LEDGER: '/shops/:shopId/customers/:id/ledger',

  // Bulk Operations
  BULK_DELETE: '/shops/:shopId/customers/bulk-delete',
  IMPORT: '/shops/:shopId/customers/import',
  EXPORT: '/shops/:shopId/customers/export',

  // Search
  SEARCH: '/shops/:shopId/customers/search',
} as const;

// ============================================================================
// SUPPLIER ENDPOINTS
// ============================================================================
export const SUPPLIER_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/suppliers',
  BY_ID: '/shops/:shopId/suppliers/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/suppliers',
  GET_ALL: '/shops/:shopId/suppliers',
  GET_BY_ID: '/shops/:shopId/suppliers/:id',
  UPDATE: '/shops/:shopId/suppliers/:id',
  DELETE: '/shops/:shopId/suppliers/:id',
  RESTORE: '/shops/:shopId/suppliers/:id/restore',

  // Supplier Operations
  TOGGLE_STATUS: '/shops/:shopId/suppliers/:id/toggle-status',
  UPDATE_RATING: '/shops/:shopId/suppliers/:id/rating',
  BLACKLIST: '/shops/:shopId/suppliers/:id/blacklist',
  REMOVE_BLACKLIST: '/shops/:shopId/suppliers/:id/remove-blacklist',
  MARK_PREFERRED: '/shops/:shopId/suppliers/:id/mark-preferred',
  REMOVE_PREFERRED: '/shops/:shopId/suppliers/:id/remove-preferred',

  // Relations
  GET_PURCHASES: '/shops/:shopId/suppliers/:id/purchases',
  GET_PRODUCTS: '/shops/:shopId/suppliers/:id/products',
  GET_LEDGER: '/shops/:shopId/suppliers/:id/ledger',

  // Stats
  GET_STATISTICS: '/shops/:shopId/suppliers/:id/statistics',
  TOP_SUPPLIERS: '/shops/:shopId/suppliers/top',

  // Bulk Operations
  BULK_DELETE: '/shops/:shopId/suppliers/bulk-delete',
  IMPORT: '/shops/:shopId/suppliers/import',
  EXPORT: '/shops/:shopId/suppliers/export',

  // Search
  SEARCH: '/shops/:shopId/suppliers/search',
} as const;

// ============================================================================
// SALES ENDPOINTS
// ============================================================================
export const SALES_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/sales',
  BY_ID: '/shops/:shopId/sales/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/sales',
  GET_ALL: '/shops/:shopId/sales',
  GET_BY_ID: '/shops/:shopId/sales/:id',
  UPDATE: '/shops/:shopId/sales/:id',
  DELETE: '/shops/:shopId/sales/:id',
  CANCEL: '/shops/:shopId/sales/:id/cancel',

  // Invoice Operations
  GENERATE_INVOICE: '/shops/:shopId/sales/:id/invoice',
  PRINT_INVOICE: '/shops/:shopId/sales/:id/print',
  EMAIL_INVOICE: '/shops/:shopId/sales/:id/email',
  DOWNLOAD_INVOICE: '/shops/:shopId/sales/:id/download',

  // Payment Operations
  ADD_PAYMENT: '/shops/:shopId/sales/:id/payments',
  GET_PAYMENTS: '/shops/:shopId/sales/:id/payments',

  // Reports
  DAILY_REPORT: '/shops/:shopId/sales/reports/daily',
  MONTHLY_REPORT: '/shops/:shopId/sales/reports/monthly',
  SUMMARY: '/shops/:shopId/sales/summary',

  // Filters
  BY_DATE_RANGE: '/shops/:shopId/sales/date-range',
  BY_CUSTOMER: '/shops/:shopId/sales/customer/:customerId',
  SEARCH: '/shops/:shopId/sales/search',
} as const;

// ============================================================================
// PURCHASE ENDPOINTS
// ============================================================================
export const PURCHASE_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/purchases',
  BY_ID: '/shops/:shopId/purchases/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/purchases',
  GET_ALL: '/shops/:shopId/purchases',
  GET_BY_ID: '/shops/:shopId/purchases/:id',
  UPDATE: '/shops/:shopId/purchases/:id',
  DELETE: '/shops/:shopId/purchases/:id',
  CANCEL: '/shops/:shopId/purchases/:id/cancel',

  // Payment Operations
  ADD_PAYMENT: '/shops/:shopId/purchases/:id/payments',
  GET_PAYMENTS: '/shops/:shopId/purchases/:id/payments',

  // Reports
  SUMMARY: '/shops/:shopId/purchases/summary',
  BY_DATE_RANGE: '/shops/:shopId/purchases/date-range',

  // Filters
  BY_SUPPLIER: '/shops/:shopId/purchases/supplier/:supplierId',
  PENDING: '/shops/:shopId/purchases/pending',
  COMPLETED: '/shops/:shopId/purchases/completed',
  SEARCH: '/shops/:shopId/purchases/search',
} as const;

// ============================================================================
// ORDER ENDPOINTS
// ============================================================================
export const ORDER_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/orders',
  BY_ID: '/shops/:shopId/orders/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/orders',
  GET_ALL: '/shops/:shopId/orders',
  GET_BY_ID: '/shops/:shopId/orders/:id',
  UPDATE: '/shops/:shopId/orders/:id',
  DELETE: '/shops/:shopId/orders/:id',
  CANCEL: '/shops/:shopId/orders/:id/cancel',

  // Status Updates
  UPDATE_STATUS: '/shops/:shopId/orders/:id/status',
  MARK_IN_PROGRESS: '/shops/:shopId/orders/:id/in-progress',
  MARK_READY: '/shops/:shopId/orders/:id/ready',
  MARK_COMPLETED: '/shops/:shopId/orders/:id/completed',
  MARK_DELIVERED: '/shops/:shopId/orders/:id/delivered',

  // Payment
  ADD_PAYMENT: '/shops/:shopId/orders/:id/payments',

  // Filters
  BY_STATUS: '/shops/:shopId/orders/status/:status',
  BY_CUSTOMER: '/shops/:shopId/orders/customer/:customerId',
  PENDING: '/shops/:shopId/orders/pending',
  IN_PROGRESS: '/shops/:shopId/orders/in-progress',
  READY: '/shops/:shopId/orders/ready',
} as const;

// ============================================================================
// SCHEME ENDPOINTS
// ============================================================================
export const SCHEME_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/schemes',
  BY_ID: '/shops/:shopId/schemes/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/schemes',
  GET_ALL: '/shops/:shopId/schemes',
  GET_BY_ID: '/shops/:shopId/schemes/:id',
  UPDATE: '/shops/:shopId/schemes/:id',
  DELETE: '/shops/:shopId/schemes/:id',

  // Scheme Operations
  TOGGLE_STATUS: '/shops/:shopId/schemes/:id/toggle-status',
  GET_ENROLLMENTS: '/shops/:shopId/schemes/:id/enrollments',
  GET_MATURED: '/shops/:shopId/schemes/:id/matured',

  // Filters
  ACTIVE: '/shops/:shopId/schemes/active',
  INACTIVE: '/shops/:shopId/schemes/inactive',
} as const;

// ============================================================================
// PAYMENT ENDPOINTS
// ============================================================================
export const PAYMENT_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/payments',
  BY_ID: '/shops/:shopId/payments/:id',

  // CRUD Operations
  CREATE: '/shops/:shopId/payments',
  GET_ALL: '/shops/:shopId/payments',
  GET_BY_ID: '/shops/:shopId/payments/:id',
  DELETE: '/shops/:shopId/payments/:id',

  // Reports
  SUMMARY: '/shops/:shopId/payments/summary',
  BY_DATE_RANGE: '/shops/:shopId/payments/date-range',
  BY_METHOD: '/shops/:shopId/payments/method/:method',
} as const;

// ============================================================================
// REPORT ENDPOINTS
// ============================================================================
export const REPORT_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/shops/:shopId/reports/dashboard',

  // Sales Reports
  SALES_SUMMARY: '/shops/:shopId/reports/sales/summary',
  SALES_BY_CATEGORY: '/shops/:shopId/reports/sales/by-category',
  SALES_BY_PRODUCT: '/shops/:shopId/reports/sales/by-product',
  SALES_BY_CUSTOMER: '/shops/:shopId/reports/sales/by-customer',

  // Purchase Reports
  PURCHASE_SUMMARY: '/shops/:shopId/reports/purchase/summary',
  PURCHASE_BY_SUPPLIER: '/shops/:shopId/reports/purchase/by-supplier',

  // Inventory Reports
  INVENTORY_SUMMARY: '/shops/:shopId/reports/inventory/summary',
  STOCK_VALUATION: '/shops/:shopId/reports/inventory/valuation',
  LOW_STOCK: '/shops/:shopId/reports/inventory/low-stock',
  DEAD_STOCK: '/shops/:shopId/reports/inventory/dead-stock',

  // Financial Reports
  PROFIT_LOSS: '/shops/:shopId/reports/financial/profit-loss',
  DAY_BOOK: '/shops/:shopId/reports/financial/day-book',
  CASH_FLOW: '/shops/:shopId/reports/financial/cash-flow',

  // Customer Reports
  CUSTOMER_LEDGER: '/shops/:shopId/reports/customer/ledger',
  TOP_CUSTOMERS: '/shops/:shopId/reports/customer/top',

  // Supplier Reports
  SUPPLIER_LEDGER: '/shops/:shopId/reports/supplier/ledger',
  TOP_SUPPLIERS: '/shops/:shopId/reports/supplier/top',
} as const;

// ============================================================================
// METAL RATE ENDPOINTS
// ============================================================================
export const METAL_RATE_ENDPOINTS = {
  // Base
  BASE: '/shops/:shopId/metal-rates',
  BY_ID: '/shops/:shopId/metal-rates/:id',

  // Operations
  CREATE: '/shops/:shopId/metal-rates',
  GET_ALL: '/shops/:shopId/metal-rates',
  GET_CURRENT: '/shops/:shopId/metal-rates/current',
  GET_HISTORY: '/shops/:shopId/metal-rates/history',
  UPDATE: '/shops/:shopId/metal-rates/:id',
  DELETE: '/shops/:shopId/metal-rates/:id',

  // By Metal Type
  BY_METAL_TYPE: '/shops/:shopId/metal-rates/:metalType',
} as const;

// ============================================================================
// EXPORT ALL ENDPOINTS
// ============================================================================
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  ORGANIZATION: ORGANIZATION_ENDPOINTS,
  SHOP: SHOP_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  CUSTOMER: CUSTOMER_ENDPOINTS,
  SUPPLIER: SUPPLIER_ENDPOINTS,
  SALES: SALES_ENDPOINTS,
  PURCHASE: PURCHASE_ENDPOINTS,
  ORDER: ORDER_ENDPOINTS,
  SCHEME: SCHEME_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  METAL_RATE: METAL_RATE_ENDPOINTS,
} as const;

export default API_ENDPOINTS;