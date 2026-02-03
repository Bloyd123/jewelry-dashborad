// FILE: src/api/endpoints.ts
// API Endpoints Configuration

const API_BASE = '/api'
const API_VERSION = '/v1'
const BASE_URL = `${API_BASE}${API_VERSION}`

// AUTHENTICATION ENDPOINTS

const AUTH_BASE = `${BASE_URL}/auth`

export const AUTH_ENDPOINTS = {
  // Registration
  REGISTER: `${AUTH_BASE}/register`,
  REGISTER_SUPER_ADMIN: `${AUTH_BASE}/register/super-admin`,

  // Login/Logout
  LOGIN: `${AUTH_BASE}/login`,
  LOGOUT: `${AUTH_BASE}/logout`,
  LOGOUT_ALL: `${AUTH_BASE}/logout-all`,

  // User Profile
  ME: `${AUTH_BASE}/me`,
  UPDATE_PROFILE: `${AUTH_BASE}/profile`,

  // Password Management
  CHANGE_PASSWORD: `${AUTH_BASE}/change-password`,
  FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_BASE}/reset-password`,

  // Email Verification
  VERIFY_EMAIL: `${AUTH_BASE}/verify-email`,
  RESEND_VERIFICATION: `${AUTH_BASE}/resend-verification`,

  // Token Management
  REFRESH_TOKEN: `${AUTH_BASE}/refresh-token`,

  // Session Management
  SESSIONS: `${AUTH_BASE}/sessions`,
  REVOKE_SESSION: `${AUTH_BASE}/sessions/:tokenId`,
  ENABLE_2FA: `${AUTH_BASE}/2fa/enable`,
  VERIFY_2FA: `${AUTH_BASE}/2fa/verify`,
  DISABLE_2FA: `${AUTH_BASE}/2fa/disable`,
  LOGIN_2FA: `${AUTH_BASE}/login/2fa`,
  LOGIN_BACKUP_CODE: `${AUTH_BASE}/login/backup-code`,
}

// Customer endpoints
export const CUSTOMER_ENDPOINTS = {
  // List & Search
  GET_ALL: `${BASE_URL}/shops/:shopId/customers`,
  GET_BY_ID: `${BASE_URL}/shops/:shopId/customers/:customerId`,
  SEARCH: `${BASE_URL}/shops/:shopId/customers/search`,

  // CRUD
  CREATE: `${BASE_URL}/shops/:shopId/customers`,
  UPDATE: `${BASE_URL}/shops/:shopId/customers/:customerId`,
  DELETE: `${BASE_URL}/shops/:shopId/customers/:customerId`,

  // Blacklist Operations
  BLACKLIST: `${BASE_URL}/shops/:shopId/customers/:customerId/blacklist`,
  UNBLACKLIST: `${BASE_URL}/shops/:shopId/customers/:customerId/unblacklist`,

  // Loyalty Operations
  ADD_LOYALTY: `${BASE_URL}/shops/:shopId/customers/:customerId/loyalty/add`,
  REDEEM_LOYALTY: `${BASE_URL}/shops/:shopId/customers/:customerId/loyalty/redeem`,

  // Analytics
  ANALYTICS: `${BASE_URL}/shops/:shopId/customers/analytics`,
} as const
export const PURCHASE_ENDPOINTS = {

  // CRUD Operations
  GET_ALL: `${BASE_URL}/shops/:shopId/purchases`,
  GET_BY_ID: `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,
  CREATE: `${BASE_URL}/shops/:shopId/purchases`,
  UPDATE: `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,
  DELETE: `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,

  // Status Management
  UPDATE_STATUS: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/status`,
  RECEIVE: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/receive`,
  CANCEL: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/cancel`,

  // Approval
  APPROVE: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/approve`,
  REJECT: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/reject`,

  // Payment Management
  ADD_PAYMENT: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/payments`,
  GET_PAYMENTS: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/payments`,

  // Supplier-Specific
  GET_BY_SUPPLIER: `${BASE_URL}/shops/:shopId/purchases/supplier/:supplierId`,

  // Analytics & Reports
  GET_ANALYTICS: `${BASE_URL}/shops/:shopId/purchases/analytics`,
  GET_PENDING: `${BASE_URL}/shops/:shopId/purchases/pending`,
  GET_UNPAID: `${BASE_URL}/shops/:shopId/purchases/unpaid`,

  // Bulk Operations
  BULK_DELETE: `${BASE_URL}/shops/:shopId/purchases/bulk-delete`,
  BULK_APPROVE: `${BASE_URL}/shops/:shopId/purchases/bulk-approve`,

  // Documents
  UPLOAD_DOCUMENT: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/documents`,
  GET_DOCUMENTS: `${BASE_URL}/shops/:shopId/purchases/:purchaseId/documents`,

  // Search & Filters
  SEARCH: `${BASE_URL}/shops/:shopId/purchases/search`,
  BY_DATE_RANGE: `${BASE_URL}/shops/:shopId/purchases/by-date-range`,
} as const



export const SUPPLIER_ENDPOINTS = {
  // List & CRUD
  GET_ALL: `${BASE_URL}/suppliers`,
  GET_BY_ID: `${BASE_URL}/suppliers/:id`,
  CREATE: `${BASE_URL}/suppliers`,
  UPDATE: `${BASE_URL}/suppliers/:id`,
  DELETE: `${BASE_URL}/suppliers/:id`,
  SEARCH: `${BASE_URL}/suppliers/search`,

  // Management Actions
  RESTORE: `${BASE_URL}/suppliers/:id/restore`,
  UPDATE_RATING: `${BASE_URL}/suppliers/:id/rating`,
  BLACKLIST: `${BASE_URL}/suppliers/:id/blacklist`,
  REMOVE_BLACKLIST: `${BASE_URL}/suppliers/:id/remove-blacklist`,
  MARK_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  REMOVE_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  UPDATE_BALANCE: `${BASE_URL}/suppliers/:id/balance`,

  // Statistics
  STATS: `${BASE_URL}/suppliers/stats`,
  TOP: `${BASE_URL}/suppliers/top`,
} as const
// SHOP ENDPOINTS

const SHOPS_BASE = `${BASE_URL}/shops`

export const SHOPS_ENDPOINTS = {
  BASE: SHOPS_BASE,
  BY_ID: `${SHOPS_BASE}/:id`,
  SETTINGS: `${SHOPS_BASE}/:id/settings`,
  METAL_RATES: `${SHOPS_BASE}/:id/metal-rates`,
  STATISTICS: `${SHOPS_BASE}/:id/statistics`,
  TRANSFER_INVENTORY: `${SHOPS_BASE}/:id/transfer-inventory`,
}

// ORGANIZATION ENDPOINTS

const ORGANIZATIONS_BASE = `${BASE_URL}/organizations`

export const ORGANIZATIONS_ENDPOINTS = {
  BASE: ORGANIZATIONS_BASE,
  BY_ID: `${ORGANIZATIONS_BASE}/:id`,
  USERS: `${ORGANIZATIONS_BASE}/:id/users`,
  SHOPS: `${ORGANIZATIONS_BASE}/:id/shops`,
  STATISTICS: `${ORGANIZATIONS_BASE}/:id/statistics`,
  SUBSCRIPTION: `${ORGANIZATIONS_BASE}/:id/subscription`,
}

// USER ENDPOINTS

const USERS_BASE = `${BASE_URL}/users`

export const USERS_ENDPOINTS = {
  BASE: USERS_BASE,
  BY_ID: `${USERS_BASE}/:id`,
  ACTIVATE: `${USERS_BASE}/:id/activate`,
  DEACTIVATE: `${USERS_BASE}/:id/deactivate`,
  RESET_PASSWORD: `${USERS_BASE}/:id/reset-password`,
  UPDATE_ROLE: `${USERS_BASE}/:id/role`,
  PERMISSIONS: `${USERS_BASE}/:id/permissions`,
  SHOP_ACCESS: `${USERS_BASE}/:id/shop-access`,
}

//
// PRODUCT ENDPOINTS
//
export const PRODUCT_ENDPOINTS = {
  // List & Search
  GET_ALL: `${BASE_URL}/shops/:shopId/products`,
  GET_BY_ID: `${BASE_URL}/shops/:shopId/products/:id`,
  SEARCH: `${BASE_URL}/shops/:shopId/products/search`,
  LOW_STOCK: `${BASE_URL}/shops/:shopId/products/low-stock`,
  ANALYTICS: `${BASE_URL}/shops/:shopId/products/analytics`,
  HISTORY: `${BASE_URL}/shops/:shopId/products/:id/history`,

  // CRUD
  CREATE: `${BASE_URL}/shops/:shopId/products`,
  UPDATE: `${BASE_URL}/shops/:shopId/products/:id`,
  DELETE: `${BASE_URL}/shops/:shopId/products/:id`,

  // Stock Management
  UPDATE_STOCK: `${BASE_URL}/shops/:shopId/products/:id/stock`,

  // Product Status
  RESERVE: `${BASE_URL}/shops/:shopId/products/:id/reserve`,
  CANCEL_RESERVATION: `${BASE_URL}/shops/:shopId/products/:id/cancel-reservation`,
  MARK_AS_SOLD: `${BASE_URL}/shops/:shopId/products/:id/sold`,

  // Pricing
  CALCULATE_PRICE: `${BASE_URL}/shops/:shopId/products/:id/calculate-price`,

  // Bulk Operations
  BULK_DELETE: `${BASE_URL}/shops/:shopId/products/bulk-delete`,
  BULK_UPDATE_STATUS: `${BASE_URL}/shops/:shopId/products/bulk-update-status`,
}

// INVENTORY ENDPOINTS

const INVENTORY_BASE = `${BASE_URL}/inventory`

export const INVENTORY_ENDPOINTS = {
  BASE: INVENTORY_BASE,
  BY_ID: `${INVENTORY_BASE}/:id`,
  STOCK_IN: `${INVENTORY_BASE}/stock-in`,
  STOCK_OUT: `${INVENTORY_BASE}/stock-out`,
  TRANSFER: `${INVENTORY_BASE}/transfer`,
  ADJUSTMENT: `${INVENTORY_BASE}/adjustment`,
  HISTORY: `${INVENTORY_BASE}/:id/history`,
}

// SALES ENDPOINTS

const SALES_BASE = `${BASE_URL}/sales`

export const SALES_ENDPOINTS = {
  BASE: SALES_BASE,
  BY_ID: `${SALES_BASE}/:id`,
  INVOICES: `${SALES_BASE}/invoices`,
  INVOICE_BY_ID: `${SALES_BASE}/invoices/:id`,
  ESTIMATES: `${SALES_BASE}/estimates`,
  ESTIMATE_BY_ID: `${SALES_BASE}/estimates/:id`,
  CONVERT_ESTIMATE: `${SALES_BASE}/estimates/:id/convert`,
  RETURNS: `${SALES_BASE}/returns`,
  RETURN_BY_ID: `${SALES_BASE}/returns/:id`,
}

// REPORTS ENDPOINTS

const REPORTS_BASE = `${BASE_URL}/reports`

export const REPORTS_ENDPOINTS = {
  SALES: `${REPORTS_BASE}/sales`,
  INVENTORY: `${REPORTS_BASE}/inventory`,
  CUSTOMERS: `${REPORTS_BASE}/customers`,
  FINANCIAL: `${REPORTS_BASE}/financial`,
  PRODUCT_PERFORMANCE: `${REPORTS_BASE}/product-performance`,
  DASHBOARD: `${REPORTS_BASE}/dashboard`,
}

// CONSOLIDATED EXPORT

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  SHOPS: SHOPS_ENDPOINTS,
  ORGANIZATIONS: ORGANIZATIONS_ENDPOINTS,
  USERS: USERS_ENDPOINTS,
  PRODUCTS: PRODUCT_ENDPOINTS,
  INVENTORY: INVENTORY_ENDPOINTS,
  SALES: SALES_ENDPOINTS,
  CUSTOMERS: CUSTOMER_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  SUPPLIER: SUPPLIER_ENDPOINTS,
  PURCHASE:PURCHASE_ENDPOINTS,
}

export default API_ENDPOINTS
