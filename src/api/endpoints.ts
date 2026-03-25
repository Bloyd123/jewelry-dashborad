// FILE: src/api/endpoints.ts

const API_BASE = '/api'
const API_VERSION = '/v1'
const BASE_URL = `${API_BASE}${API_VERSION}`

const AUTH_BASE = `${BASE_URL}/auth`

export const AUTH_ENDPOINTS = {
  REGISTER: `${AUTH_BASE}/register`,
ACTIVITY_LOGS: `${AUTH_BASE}/activity-logs`,
  REGISTER_SUPER_ADMIN: `${AUTH_BASE}/register/super-admin`,

  LOGIN: `${AUTH_BASE}/login`,
  LOGOUT: `${AUTH_BASE}/logout`,
  LOGOUT_ALL: `${AUTH_BASE}/logout-all`,

  ME: `${AUTH_BASE}/me`,
  UPDATE_PROFILE: `${AUTH_BASE}/profile`,

  CHANGE_PASSWORD: `${AUTH_BASE}/change-password`,
  FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_BASE}/reset-password`,

  VERIFY_EMAIL: `${AUTH_BASE}/verify-email`,
  RESEND_VERIFICATION: `${AUTH_BASE}/resend-verification`,

  REFRESH_TOKEN: `${AUTH_BASE}/refresh-token`,

  SESSIONS: `${AUTH_BASE}/sessions`,
  REVOKE_SESSION: `${AUTH_BASE}/sessions/:tokenId`,
  ENABLE_2FA: `${AUTH_BASE}/2fa/enable`,
  VERIFY_2FA: `${AUTH_BASE}/2fa/verify`,
  DISABLE_2FA: `${AUTH_BASE}/2fa/disable`,
  LOGIN_2FA: `${AUTH_BASE}/login/2fa`,
  LOGIN_BACKUP_CODE: `${AUTH_BASE}/login/backup-code`,
}

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

export const SHOP_ENDPOINTS = {
  GET_ALL:         `${BASE_URL}/shops`,
  GET_BY_ID:       `${BASE_URL}/shops/:id`,
  CREATE:          `${BASE_URL}/shops`,
  UPDATE:          `${BASE_URL}/shops/:id`,
  DELETE:          `${BASE_URL}/shops/:id`,
  UPDATE_SETTINGS: `${BASE_URL}/shops/:id/settings`,
  STATISTICS:      `${BASE_URL}/shops/:id/statistics`,
  ACTIVITY_LOGS: `${BASE_URL}/shops/:id/activity-logs`,
}
 
export const PURCHASE_ENDPOINTS = {
  // List & Search
  GET_ALL:        `${BASE_URL}/shops/:shopId/purchases`,
  GET_BY_ID:      `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,
  SEARCH:         `${BASE_URL}/shops/:shopId/purchases/search`,
  BY_DATE_RANGE:  `${BASE_URL}/shops/:shopId/purchases/by-date-range`,
  BY_SUPPLIER:    `${BASE_URL}/shops/:shopId/purchases/supplier/:supplierId`,
  PENDING:        `${BASE_URL}/shops/:shopId/purchases/pending`,
  UNPAID:         `${BASE_URL}/shops/:shopId/purchases/unpaid`,
  ANALYTICS:      `${BASE_URL}/shops/:shopId/purchases/analytics`,
 
  // CRUD
  CREATE:         `${BASE_URL}/shops/:shopId/purchases`,
  UPDATE:         `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,
  DELETE:         `${BASE_URL}/shops/:shopId/purchases/:purchaseId`,
 
  // Status Actions
  UPDATE_STATUS:  `${BASE_URL}/shops/:shopId/purchases/:purchaseId/status`,
  RECEIVE:        `${BASE_URL}/shops/:shopId/purchases/:purchaseId/receive`,
  CANCEL:         `${BASE_URL}/shops/:shopId/purchases/:purchaseId/cancel`,
  RETURN:         `${BASE_URL}/shops/:shopId/purchases/:purchaseId/return`,
 
  // Approval
  APPROVE:        `${BASE_URL}/shops/:shopId/purchases/:purchaseId/approve`,
  REJECT:         `${BASE_URL}/shops/:shopId/purchases/:purchaseId/reject`,
  BULK_APPROVE:   `${BASE_URL}/shops/:shopId/purchases/bulk-approve`,
  BULK_DELETE:    `${BASE_URL}/shops/:shopId/purchases/bulk-delete`,
 
  // Payments
  ADD_PAYMENT:    `${BASE_URL}/shops/:shopId/purchases/:purchaseId/payments`,
  GET_PAYMENTS:   `${BASE_URL}/shops/:shopId/purchases/:purchaseId/payments`,
 
  // Documents
  UPLOAD_DOC:     `${BASE_URL}/shops/:shopId/purchases/:purchaseId/documents`,
  GET_DOCS:       `${BASE_URL}/shops/:shopId/purchases/:purchaseId/documents`,
}

export const SUPPLIER_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/suppliers`,
  GET_BY_ID: `${BASE_URL}/suppliers/:id`,
  CREATE: `${BASE_URL}/suppliers`,
  UPDATE: `${BASE_URL}/suppliers/:id`,
  DELETE: `${BASE_URL}/suppliers/:id`,
  SEARCH: `${BASE_URL}/suppliers/search`,

  RESTORE: `${BASE_URL}/suppliers/:id/restore`,
  UPDATE_RATING: `${BASE_URL}/suppliers/:id/rating`,
  BLACKLIST: `${BASE_URL}/suppliers/:id/blacklist`,
  REMOVE_BLACKLIST: `${BASE_URL}/suppliers/:id/remove-blacklist`,
  MARK_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  REMOVE_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  UPDATE_BALANCE: `${BASE_URL}/suppliers/:id/balance`,

  STATS: `${BASE_URL}/suppliers/stats`,
  TOP: `${BASE_URL}/suppliers/top`,
} as const

const SHOPS_BASE = `${BASE_URL}/shops`

export const SHOPS_ENDPOINTS = {
  BASE: SHOPS_BASE,
  BY_ID: `${SHOPS_BASE}/:id`,
  SETTINGS: `${SHOPS_BASE}/:id/settings`,
  METAL_RATES: `${SHOPS_BASE}/:id/metal-rates`,
  STATISTICS: `${SHOPS_BASE}/:id/statistics`,
  TRANSFER_INVENTORY: `${SHOPS_BASE}/:id/transfer-inventory`,
}

const ORGANIZATIONS_BASE = `${BASE_URL}/organizations`

export const ORGANIZATIONS_ENDPOINTS = {
  BASE: ORGANIZATIONS_BASE,
  BY_ID: `${ORGANIZATIONS_BASE}/:id`,
  USERS: `${ORGANIZATIONS_BASE}/:id/users`,
  SHOPS: `${ORGANIZATIONS_BASE}/:id/shops`,
  STATISTICS: `${ORGANIZATIONS_BASE}/:id/statistics`,
  SUBSCRIPTION: `${ORGANIZATIONS_BASE}/:id/subscription`,
}

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

export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${BASE_URL}/shops/:shopId/product`,
  GET_BY_ID: `${BASE_URL}/shops/:shopId/product/:id`,
  SEARCH: `${BASE_URL}/shops/:shopId/product/search`,
  LOW_STOCK: `${BASE_URL}/shops/:shopId/product/low-stock`,
  ANALYTICS: `${BASE_URL}/shops/:shopId/product/analytics`,
  HISTORY: `${BASE_URL}/shops/:shopId/product/:id/history`,

  CREATE: `${BASE_URL}/shops/:shopId/product`,
  UPDATE: `${BASE_URL}/shops/:shopId/product/:id`,
  DELETE: `${BASE_URL}/shops/:shopId/product/:id`,

  UPDATE_STOCK: `${BASE_URL}/shops/:shopId/product/:id/stock`,

  RESERVE: `${BASE_URL}/shops/:shopId/product/:id/reserve`,
  CANCEL_RESERVATION: `${BASE_URL}/shops/:shopId/product/:id/cancel-reservation`,
  MARK_AS_SOLD: `${BASE_URL}/shops/:shopId/product/:id/sold`,

  CALCULATE_PRICE: `${BASE_URL}/shops/:shopId/product/:id/calculate-price`,

  BULK_DELETE: `${BASE_URL}/shops/:shopId/product/bulk-delete`,
  BULK_UPDATE_STATUS: `${BASE_URL}/shops/:shopId/product/bulk-update-status`,
}

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

const REPORTS_BASE = `${BASE_URL}/reports`

export const REPORTS_ENDPOINTS = {
  SALES: `${REPORTS_BASE}/sales`,
  INVENTORY: `${REPORTS_BASE}/inventory`,
  CUSTOMERS: `${REPORTS_BASE}/customers`,
  FINANCIAL: `${REPORTS_BASE}/financial`,
  PRODUCT_PERFORMANCE: `${REPORTS_BASE}/product-performance`,
  DASHBOARD: `${REPORTS_BASE}/dashboard`,
}

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
  PURCHASE: PURCHASE_ENDPOINTS,
}

export default API_ENDPOINTS
