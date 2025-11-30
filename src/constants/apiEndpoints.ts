// ============================================================================
// FILE: src/constants/apiEndpoints.ts
// Central API endpoint configuration for Karat Track frontend
// ============================================================================

/**
 * Base API URL - should come from environment variables
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * API version prefix
 */
export const API_VERSION = '/api/v1'

/**
 * Complete base URL with version
 */
export const API_URL = `${API_BASE_URL}${API_VERSION}`

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const AUTH_ENDPOINTS = {
  // Registration
  REGISTER_SUPER_ADMIN: `${API_URL}/auth/register/super-admin`,
  REGISTER: `${API_URL}/auth/register`,

  // Authentication
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  LOGOUT_ALL: `${API_URL}/auth/logout-all`,
  REFRESH_TOKEN: `${API_URL}/auth/refresh-token`,

  // Profile
  ME: `${API_URL}/auth/me`,
  UPDATE_PROFILE: `${API_URL}/auth/profile`,
  CHANGE_PASSWORD: `${API_URL}/auth/change-password`,

  // Password Reset
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,

  // Email Verification
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_URL}/auth/resend-verification`,

  // Sessions
  GET_SESSIONS: `${API_URL}/auth/sessions`,
  REVOKE_SESSION: (tokenId: string) => `${API_URL}/auth/sessions/${tokenId}`,
} as const

// ============================================================================
// ORGANIZATION ENDPOINTS
// ============================================================================

export const ORGANIZATION_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/organizations`,

  // CRUD Operations
  LIST: `${API_URL}/organizations`,
  CREATE: `${API_URL}/organizations`,
  GET_BY_ID: (id: string) => `${API_URL}/organizations/${id}`,
  UPDATE: (id: string) => `${API_URL}/organizations/${id}`,
  DELETE: (id: string) => `${API_URL}/organizations/${id}`,

  // Organization Management
  GET_STATS: (id: string) => `${API_URL}/organizations/${id}/stats`,
  GET_SHOPS: (id: string) => `${API_URL}/organizations/${id}/shops`,
  GET_USERS: (id: string) => `${API_URL}/organizations/${id}/users`,

  // Subscription & Billing
  UPDATE_SUBSCRIPTION: (id: string) =>
    `${API_URL}/organizations/${id}/subscription`,
  GET_USAGE_STATS: (id: string) => `${API_URL}/organizations/${id}/usage`,

  // Settings
  UPDATE_SETTINGS: (id: string) => `${API_URL}/organizations/${id}/settings`,
} as const

// ============================================================================
// SHOP ENDPOINTS
// ============================================================================

export const SHOP_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/shops`,

  // CRUD Operations
  LIST: `${API_URL}/shops`,
  CREATE: `${API_URL}/shops`,
  GET_BY_ID: (id: string) => `${API_URL}/shops/${id}`,
  UPDATE: (id: string) => `${API_URL}/shops/${id}`,
  DELETE: (id: string) => `${API_URL}/shops/${id}`,
  RESTORE: (id: string) => `${API_URL}/shops/${id}/restore`,

  // Shop Management
  GET_STATS: (id: string) => `${API_URL}/shops/${id}/stats`,
  GET_USERS: (id: string) => `${API_URL}/shops/${id}/users`,
  GET_INVENTORY: (id: string) => `${API_URL}/shops/${id}/inventory`,

  // Settings
  UPDATE_SETTINGS: (id: string) => `${API_URL}/shops/${id}/settings`,
} as const

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export const USER_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/users`,

  // CRUD Operations
  LIST: `${API_URL}/users`,
  CREATE: `${API_URL}/users`,
  GET_BY_ID: (id: string) => `${API_URL}/users/${id}`,
  UPDATE: (id: string) => `${API_URL}/users/${id}`,
  DELETE: (id: string) => `${API_URL}/users/${id}`,

  // User Management
  ACTIVATE: (id: string) => `${API_URL}/users/${id}/activate`,
  DEACTIVATE: (id: string) => `${API_URL}/users/${id}/deactivate`,
  RESET_PASSWORD: (id: string) => `${API_URL}/users/${id}/reset-password`,

  // Access Management
  GET_SHOP_ACCESS: (id: string) => `${API_URL}/users/${id}/shop-access`,
  GRANT_SHOP_ACCESS: (id: string) => `${API_URL}/users/${id}/shop-access`,
  REVOKE_SHOP_ACCESS: (id: string, accessId: string) =>
    `${API_URL}/users/${id}/shop-access/${accessId}`,
  UPDATE_PERMISSIONS: (id: string, accessId: string) =>
    `${API_URL}/users/${id}/shop-access/${accessId}/permissions`,
} as const

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================

export const CUSTOMER_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/customers`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/customers`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/customers`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}`,
  DELETE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}`,

  // Customer Management
  GET_ORDERS: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}/orders`,
  GET_TRANSACTIONS: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}/transactions`,
  GET_SCHEMES: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/customers/${id}/schemes`,

  // Search & Filter
  SEARCH: (shopId: string) => `${API_URL}/shops/${shopId}/customers/search`,
  EXPORT: (shopId: string) => `${API_URL}/shops/${shopId}/customers/export`,
} as const

// ============================================================================
// SUPPLIER ENDPOINTS
// ============================================================================

export const SUPPLIER_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/suppliers`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/suppliers`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/suppliers`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/suppliers/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/suppliers/${id}`,
  DELETE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/suppliers/${id}`,

  // Supplier Management
  GET_PURCHASES: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/suppliers/${id}/purchases`,
  GET_PAYMENTS: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/suppliers/${id}/payments`,
} as const

// ============================================================================
// PRODUCT/INVENTORY ENDPOINTS
// ============================================================================

export const PRODUCT_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/products`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/products`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/products`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}`,
  DELETE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}`,

  // Inventory Management
  ADJUST_STOCK: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}/adjust-stock`,
  TRANSFER_STOCK: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}/transfer`,
  GET_STOCK_HISTORY: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/products/${id}/stock-history`,

  // Bulk Operations
  BULK_IMPORT: (shopId: string) =>
    `${API_URL}/shops/${shopId}/products/bulk-import`,
  BULK_UPDATE: (shopId: string) =>
    `${API_URL}/shops/${shopId}/products/bulk-update`,
  EXPORT: (shopId: string) => `${API_URL}/shops/${shopId}/products/export`,

  // Search & Filter
  SEARCH: (shopId: string) => `${API_URL}/shops/${shopId}/products/search`,
  LOW_STOCK: (shopId: string) =>
    `${API_URL}/shops/${shopId}/products/low-stock`,
} as const

// ============================================================================
// SALES ENDPOINTS
// ============================================================================

export const SALE_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/sales`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/sales`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/sales`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}`,
  CANCEL: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}/cancel`,

  // Invoice Management
  GET_INVOICE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}/invoice`,
  DOWNLOAD_INVOICE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}/invoice/download`,
  EMAIL_INVOICE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/sales/${id}/invoice/email`,

  // Reports
  DAILY_REPORT: (shopId: string) =>
    `${API_URL}/shops/${shopId}/sales/reports/daily`,
  MONTHLY_REPORT: (shopId: string) =>
    `${API_URL}/shops/${shopId}/sales/reports/monthly`,
  CUSTOM_REPORT: (shopId: string) =>
    `${API_URL}/shops/${shopId}/sales/reports/custom`,
} as const

// ============================================================================
// PURCHASE ENDPOINTS
// ============================================================================

export const PURCHASE_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/purchases`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/purchases`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/purchases`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/purchases/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/purchases/${id}`,
  CANCEL: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/purchases/${id}/cancel`,

  // Reports
  REPORTS: (shopId: string) => `${API_URL}/shops/${shopId}/purchases/reports`,
} as const

// ============================================================================
// PAYMENT ENDPOINTS
// ============================================================================

export const PAYMENT_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/payments`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/payments`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/payments`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/payments/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/payments/${id}`,
  DELETE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/payments/${id}`,

  // Payment Management
  VERIFY: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/payments/${id}/verify`,
  GET_RECEIPT: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/payments/${id}/receipt`,
} as const

// ============================================================================
// ORDER/SCHEME ENDPOINTS
// ============================================================================

export const ORDER_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/orders`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/orders`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/orders`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/orders/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/orders/${id}`,
  CANCEL: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/orders/${id}/cancel`,

  // Order Status
  UPDATE_STATUS: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/orders/${id}/status`,
  TRACK: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/orders/${id}/track`,
} as const

export const SCHEME_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/schemes`,

  // CRUD Operations
  LIST: (shopId: string) => `${API_URL}/shops/${shopId}/schemes`,
  CREATE: (shopId: string) => `${API_URL}/shops/${shopId}/schemes`,
  GET_BY_ID: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/schemes/${id}`,
  UPDATE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/schemes/${id}`,
  CLOSE: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/schemes/${id}/close`,

  // Installments
  ADD_INSTALLMENT: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/schemes/${id}/installments`,
  GET_INSTALLMENTS: (shopId: string, id: string) =>
    `${API_URL}/shops/${shopId}/schemes/${id}/installments`,
} as const

// ============================================================================
// METAL RATE ENDPOINTS
// ============================================================================

export const METAL_RATE_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/metal-rates`,

  // Current Rates
  GET_CURRENT: (shopId: string) =>
    `${API_URL}/shops/${shopId}/metal-rates/current`,
  UPDATE_RATES: (shopId: string) => `${API_URL}/shops/${shopId}/metal-rates`,

  // History
  GET_HISTORY: (shopId: string) =>
    `${API_URL}/shops/${shopId}/metal-rates/history`,
  GET_BY_DATE: (shopId: string, date: string) =>
    `${API_URL}/shops/${shopId}/metal-rates/date/${date}`,
} as const

// ============================================================================
// REPORTS & ANALYTICS ENDPOINTS
// ============================================================================

export const REPORT_ENDPOINTS = {
  // Dashboard
  DASHBOARD_STATS: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/dashboard`,

  // Sales Reports
  SALES_SUMMARY: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/sales/summary`,
  SALES_BY_CATEGORY: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/sales/by-category`,
  SALES_BY_CUSTOMER: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/sales/by-customer`,

  // Purchase Reports
  PURCHASE_SUMMARY: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/purchase/summary`,

  // Inventory Reports
  INVENTORY_SUMMARY: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/inventory/summary`,
  STOCK_VALUATION: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/inventory/valuation`,

  // Financial Reports
  PROFIT_LOSS: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/financial/profit-loss`,
  BALANCE_SHEET: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/financial/balance-sheet`,
  CASH_FLOW: (shopId: string) =>
    `${API_URL}/shops/${shopId}/reports/financial/cash-flow`,

  // Custom Reports
  CUSTOM: (shopId: string) => `${API_URL}/shops/${shopId}/reports/custom`,
  EXPORT: (shopId: string) => `${API_URL}/shops/${shopId}/reports/export`,
} as const

// ============================================================================
// ACTIVITY LOG ENDPOINTS
// ============================================================================

export const ACTIVITY_LOG_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/activity-logs`,

  // Get Logs
  GET_SHOP_LOGS: (shopId: string) => `${API_URL}/shops/${shopId}/activity-logs`,
  GET_USER_LOGS: (userId: string) => `${API_URL}/users/${userId}/activity-logs`,
  GET_ORGANIZATION_LOGS: (orgId: string) =>
    `${API_URL}/organizations/${orgId}/activity-logs`,

  // Export
  EXPORT: (shopId: string) => `${API_URL}/shops/${shopId}/activity-logs/export`,
} as const

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

export const NOTIFICATION_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/notifications`,

  // Get Notifications
  LIST: `${API_URL}/notifications`,
  GET_UNREAD: `${API_URL}/notifications/unread`,
  GET_UNREAD_COUNT: `${API_URL}/notifications/unread/count`,

  // Mark as Read
  MARK_AS_READ: (id: string) => `${API_URL}/notifications/${id}/read`,
  MARK_ALL_AS_READ: `${API_URL}/notifications/read-all`,

  // Delete
  DELETE: (id: string) => `${API_URL}/notifications/${id}`,
  DELETE_ALL: `${API_URL}/notifications/delete-all`,
} as const

// ============================================================================
// FILE UPLOAD ENDPOINTS
// ============================================================================

export const UPLOAD_ENDPOINTS = {
  // Base
  BASE: `${API_URL}/upload`,

  // Upload Types
  IMAGE: `${API_URL}/upload/image`,
  DOCUMENT: `${API_URL}/upload/document`,
  BULK_CSV: `${API_URL}/upload/bulk-csv`,

  // Delete
  DELETE: (fileId: string) => `${API_URL}/upload/${fileId}`,
} as const

// ============================================================================
// EXPORT ALL ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ORGANIZATION: ORGANIZATION_ENDPOINTS,
  SHOP: SHOP_ENDPOINTS,
  USER: USER_ENDPOINTS,
  CUSTOMER: CUSTOMER_ENDPOINTS,
  SUPPLIER: SUPPLIER_ENDPOINTS,
  PRODUCT: PRODUCT_ENDPOINTS,
  SALE: SALE_ENDPOINTS,
  PURCHASE: PURCHASE_ENDPOINTS,
  PAYMENT: PAYMENT_ENDPOINTS,
  ORDER: ORDER_ENDPOINTS,
  SCHEME: SCHEME_ENDPOINTS,
  METAL_RATE: METAL_RATE_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  ACTIVITY_LOG: ACTIVITY_LOG_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
} as const

// ============================================================================
// TYPE EXPORTS FOR TYPESCRIPT
// ============================================================================

export type ApiEndpoints = typeof API_ENDPOINTS
export type AuthEndpoints = typeof AUTH_ENDPOINTS
export type OrganizationEndpoints = typeof ORGANIZATION_ENDPOINTS
export type ShopEndpoints = typeof SHOP_ENDPOINTS
export type UserEndpoints = typeof USER_ENDPOINTS

export default API_ENDPOINTS
