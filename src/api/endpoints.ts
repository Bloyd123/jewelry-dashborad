// FILE: src/api/endpoints.ts
const API_BASE = '/api'
const API_VERSION = '/v1'
const BASE_URL = `${API_BASE}${API_VERSION}`

const AUTH_BASE = `${BASE_URL}/auth`
export const GIRVI_CASHBOOK_ENDPOINTS = {
  // Base: /api/v1/shops/:shopId/girvi-cashbook

  GET_ALL:         `/api/v1/shops/:shopId/girvi-cashbook`,
  GET_BY_ID:       `/api/v1/shops/:shopId/girvi-cashbook/:entryId`,
  CREATE:          `/api/v1/shops/:shopId/girvi-cashbook`,
  DELETE:          `/api/v1/shops/:shopId/girvi-cashbook/:entryId`,

  GET_BALANCE:     `/api/v1/shops/:shopId/girvi-cashbook/balance`,
  DAILY_SUMMARY:   `/api/v1/shops/:shopId/girvi-cashbook/summary/daily`,
  MONTHLY_SUMMARY: `/api/v1/shops/:shopId/girvi-cashbook/summary/monthly`,
  YEARLY_SUMMARY:  `/api/v1/shops/:shopId/girvi-cashbook/summary/yearly`,

  GIRVI_CASHBOOK:  `/api/v1/shops/:shopId/girvi-cashbook/girvi/:girviId`,
}
export const GIRVI_PAYMENT_ENDPOINTS = {
  ADD:        `${BASE_URL}/shops/:shopId/girvi/:girviId/payments`,
  GET_ALL:    `${BASE_URL}/shops/:shopId/girvi/:girviId/payments`,
  GET_BY_ID:  `${BASE_URL}/shops/:shopId/girvi/:girviId/payments/:paymentId`,
  DELETE:     `${BASE_URL}/shops/:shopId/girvi/:girviId/payments/:paymentId`,
 
  // Route: GET /shops/:shopId/girvi-payments
  SHOP_ALL:   `${BASE_URL}/shops/:shopId/girvi-payments`,
}
export const GIRVI_TRANSFER_ENDPOINTS = {
  // Base: /api/v1/shops/:shopId/girvi/:girviId/transfers

  TRANSFER_OUT:       `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers`,
  GET_BY_GIRVI:       `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers`,
  GET_BY_ID:          `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers/:transferId`,
  PARTY_INTEREST:     `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers/:transferId/party-interest`,
  TRANSFER_RETURN:    `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers/:transferId/return`,
  CANCEL_TRANSFER:    `${BASE_URL}/shops/:shopId/girvi/:girviId/transfers/:transferId/cancel`,

  // Base: /api/v1/shops/:shopId/girvi-transfers
  GET_SHOP_TRANSFERS: `${BASE_URL}/shops/:shopId/girvi-transfers`,
}
export const GIRVI_ENDPOINTS = {
  STATISTICS:    `${BASE_URL}/shops/:shopId/girvi/statistics`,
 
  CREATE:        `${BASE_URL}/shops/:shopId/girvi`,
  GET_ALL:       `${BASE_URL}/shops/:shopId/girvi`,
  GET_BY_ID:     `${BASE_URL}/shops/:shopId/girvi/:girviId`,
  UPDATE:        `${BASE_URL}/shops/:shopId/girvi/:girviId`,
  DELETE:        `${BASE_URL}/shops/:shopId/girvi/:girviId`,
 
  CALCULATE_INTEREST: `${BASE_URL}/shops/:shopId/girvi/:girviId/interest`,
 
  RELEASE:       `${BASE_URL}/shops/:shopId/girvi/:girviId/release`,
}
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
export const OPENING_BALANCE_ENDPOINTS = {
  GET_STATUS:  `${BASE_URL}/shops/:shopId/opening-balance/status`,
  GET:         `${BASE_URL}/shops/:shopId/opening-balance`,
  CREATE_UPDATE: `${BASE_URL}/shops/:shopId/opening-balance`,
  CONFIRM:     `${BASE_URL}/shops/:shopId/opening-balance/confirm`,
}

export const SALE_ENDPOINTS = {
  GET_ALL:          `${BASE_URL}/shops/:shopId/sales`,
  GET_BY_ID:        `${BASE_URL}/shops/:shopId/sales/:saleId`,
  CREATE:           `${BASE_URL}/shops/:shopId/sales`,
  UPDATE:           `${BASE_URL}/shops/:shopId/sales/:saleId`,
  DELETE:           `${BASE_URL}/shops/:shopId/sales/:saleId`,
 TOP_PRODUCTS: `${BASE_URL}/shops/:shopId/sales/top-products`,
  UPDATE_STATUS:    `${BASE_URL}/shops/:shopId/sales/:saleId/status`,
  CONFIRM:          `${BASE_URL}/shops/:shopId/sales/:saleId/confirm`,
  DELIVER:          `${BASE_URL}/shops/:shopId/sales/:saleId/deliver`,
  COMPLETE:         `${BASE_URL}/shops/:shopId/sales/:saleId/complete`,
  CANCEL:           `${BASE_URL}/shops/:shopId/sales/:saleId/cancel`,
 
  ADD_PAYMENT:      `${BASE_URL}/shops/:shopId/sales/:saleId/payments`,
  GET_PAYMENTS:     `${BASE_URL}/shops/:shopId/sales/:saleId/payments`,
  GENERATE_RECEIPT: `${BASE_URL}/shops/:shopId/sales/:saleId/receipt`,
  SEND_REMINDER:    `${BASE_URL}/shops/:shopId/sales/:saleId/send-reminder`,
  RETURN:           `${BASE_URL}/shops/:shopId/sales/:saleId/return`,
  RETURN_DETAILS:   `${BASE_URL}/shops/:shopId/sales/:saleId/return-details`,
 
  ADD_OLD_GOLD:     `${BASE_URL}/shops/:shopId/sales/:saleId/old-gold`,
  REMOVE_OLD_GOLD:  `${BASE_URL}/shops/:shopId/sales/:saleId/old-gold`,
 
  GENERATE_INVOICE: `${BASE_URL}/shops/:shopId/sales/:saleId/invoice`,
  SEND_INVOICE:     `${BASE_URL}/shops/:shopId/sales/:saleId/invoice/send`,
  PRINT_INVOICE:    `${BASE_URL}/shops/:shopId/sales/:saleId/invoice/print`,
 
  APPLY_DISCOUNT:   `${BASE_URL}/shops/:shopId/sales/:saleId/apply-discount`,
  REMOVE_DISCOUNT:  `${BASE_URL}/shops/:shopId/sales/:saleId/remove-discount`,
 
  UPLOAD_DOCUMENT:  `${BASE_URL}/shops/:shopId/sales/:saleId/documents`,
  GET_DOCUMENTS:    `${BASE_URL}/shops/:shopId/sales/:saleId/documents`,
 
  APPROVE:          `${BASE_URL}/shops/:shopId/sales/:saleId/approve`,
  REJECT:           `${BASE_URL}/shops/:shopId/sales/:saleId/reject`,
 
  ANALYTICS:        `${BASE_URL}/shops/:shopId/sales/analytics`,
  DASHBOARD:        `${BASE_URL}/shops/:shopId/sales/dashboard`,
  TODAY:            `${BASE_URL}/shops/:shopId/sales/today`,
  PENDING:          `${BASE_URL}/shops/:shopId/sales/pending`,
  UNPAID:           `${BASE_URL}/shops/:shopId/sales/unpaid`,
  OVERDUE:          `${BASE_URL}/shops/:shopId/sales/overdue`,
 
  SEARCH:           `${BASE_URL}/shops/:shopId/sales/search`,
  BY_DATE_RANGE:    `${BASE_URL}/shops/:shopId/sales/by-date-range`,
  BY_AMOUNT_RANGE:  `${BASE_URL}/shops/:shopId/sales/by-amount-range`,
  CUSTOMER_SALES:         `${BASE_URL}/shops/:shopId/sales/customer/:customerId`,
  CUSTOMER_SALES_SUMMARY: `${BASE_URL}/shops/:shopId/sales/customer/:customerId/summary`,
  SALESPERSON_SALES:      `${BASE_URL}/shops/:shopId/sales/sales-person/:userId`,
  SALESPERSON_PERFORMANCE:`${BASE_URL}/shops/:shopId/sales/sales-person/:userId/performance`,
 
  BULK_DELETE:      `${BASE_URL}/shops/:shopId/sales/bulk-delete`,
  BULK_PRINT:       `${BASE_URL}/shops/:shopId/sales/bulk-print`,
  BULK_REMINDERS:   `${BASE_URL}/shops/:shopId/sales/bulk-send-reminders`,
  ANALYTICS_BY_CATEGORY:       `${BASE_URL}/shops/:shopId/sales/analytics/by-category`,
ANALYTICS_MONTHLY_COMPARISON: `${BASE_URL}/shops/:shopId/sales/analytics/monthly-comparison`,
ANALYTICS_REVENUE_EXPENSES:   `${BASE_URL}/shops/:shopId/sales/analytics/revenue-expenses`,
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
    ADVANCED_ANALYTICS:   `${BASE_URL}/shops/:shopId/customers/advanced-analytics`,  // NEW
  ACTIVITY:             `${BASE_URL}/shops/:shopId/customers/:customerId/activity`, // NEW
  DOCUMENTS:           `${BASE_URL}/shops/:shopId/customers/:customerId/documents`, // NEW
  LOYALTY_SUMMARY:     `${BASE_URL}/shops/:shopId/customers/:customerId/loyalty-summary`, 
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
 export const METAL_RATE_ENDPOINTS = {
  CREATE_OR_UPDATE:       `${BASE_URL}/shops/:shopId/metal-rates`,
  GET_CURRENT:            `${BASE_URL}/shops/:shopId/metal-rates/current`,
  GET_HISTORY:            `${BASE_URL}/shops/:shopId/metal-rates/history`,
  GET_LATEST:             `${BASE_URL}/shops/:shopId/metal-rates/latest`,
  GET_TRENDS:             `${BASE_URL}/shops/:shopId/metal-rates/trends`,
  COMPARE:                `${BASE_URL}/shops/:shopId/metal-rates/compare`,
  GET_BY_DATE:            `${BASE_URL}/shops/:shopId/metal-rates/date/:date`,
  GET_FOR_PURITY:         `${BASE_URL}/shops/:shopId/metal-rates/current/purity/:metalType/:purity`,
  GET_AVERAGE:            `${BASE_URL}/shops/:shopId/metal-rates/average`,
  SYNC_TO_ALL_SHOPS:      `${BASE_URL}/organizations/:organizationId/metal-rates/sync`,
  GET_ORGANIZATION_RATE:  `${BASE_URL}/organizations/:organizationId/metal-rates/current`,
  DEACTIVATE:             `${BASE_URL}/metal-rates/:rateId/deactivate`,
  DELETE:                 `${BASE_URL}/metal-rates/:rateId`,
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
  SEARCH: `${BASE_URL}/suppliers`,

  RESTORE: `${BASE_URL}/suppliers/:id/restore`,
  UPDATE_RATING: `${BASE_URL}/suppliers/:id/rating`,
  BLACKLIST: `${BASE_URL}/suppliers/:id/blacklist`,
  REMOVE_BLACKLIST: `${BASE_URL}/suppliers/:id/remove-blacklist`,
  MARK_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  REMOVE_PREFERRED: `${BASE_URL}/suppliers/:id/preferred`,
  UPDATE_BALANCE: `${BASE_URL}/suppliers/:id/balance`,
  ADD_DOCUMENT: `${BASE_URL}/suppliers/:id/documents`,
DELETE_DOCUMENT: `${BASE_URL}/suppliers/:id/documents/:documentId`,
ADD_CERTIFICATION: `${BASE_URL}/suppliers/:id/certifications`,
DELETE_CERTIFICATION: `${BASE_URL}/suppliers/:id/certifications/:certificationId`,
ACTIVITY: `${BASE_URL}/suppliers/:id/activity`,

  STATS: `${BASE_URL}/suppliers/stats`,
  TOP: `${BASE_URL}/suppliers/top`,
} as const
const ORGANIZATIONS_BASE = `${BASE_URL}/organizations`

export const ORGANIZATIONS_ENDPOINTS = {
  BASE: ORGANIZATIONS_BASE,
  BY_ID: `${ORGANIZATIONS_BASE}/:id`,
  USERS: `${ORGANIZATIONS_BASE}/:id/users`,
  SHOPS: `${ORGANIZATIONS_BASE}/:id/shops`,
  STATISTICS: `${ORGANIZATIONS_BASE}/:id/statistics`,
  SUBSCRIPTION: `${ORGANIZATIONS_BASE}/:id/subscription`,
}
export const PAYMENT_ENDPOINTS = {
  // ── CRUD ──────────────────────────────────────────────────
  GET_ALL:          `${BASE_URL}/shops/:shopId/payments`,
  GET_BY_ID:        `${BASE_URL}/shops/:shopId/payments/:paymentId`,
  CREATE:           `${BASE_URL}/shops/:shopId/payments`,
  UPDATE:           `${BASE_URL}/shops/:shopId/payments/:paymentId`,
  DELETE:           `${BASE_URL}/shops/:shopId/payments/:paymentId`,
 
  // ── STATUS ────────────────────────────────────────────────
  UPDATE_STATUS:    `${BASE_URL}/shops/:shopId/payments/:paymentId/status`,
  MARK_COMPLETED:   `${BASE_URL}/shops/:shopId/payments/:paymentId/complete`,
  CANCEL:           `${BASE_URL}/shops/:shopId/payments/:paymentId/cancel`,
 
  // ── CHEQUES ───────────────────────────────────────────────
  CHEQUES_PENDING:  `${BASE_URL}/shops/:shopId/payments/cheques/pending`,
  CHEQUE_CLEAR:     `${BASE_URL}/shops/:shopId/payments/:paymentId/cheque/clear`,
  CHEQUE_BOUNCE:    `${BASE_URL}/shops/:shopId/payments/:paymentId/cheque/bounce`,
  CHEQUES_BOUNCED:  `${BASE_URL}/shops/:shopId/payments/cheques/bounced`,
  CHEQUES_CLEARED:  `${BASE_URL}/shops/:shopId/payments/cheques/cleared`,
 
  // ── RECONCILIATION ────────────────────────────────────────
  RECONCILIATION_PENDING: `${BASE_URL}/shops/:shopId/payments/reconciliation/pending`,
  RECONCILE:              `${BASE_URL}/shops/:shopId/payments/:paymentId/reconcile`,
  RECONCILIATION_SUMMARY: `${BASE_URL}/shops/:shopId/payments/reconciliation/summary`,
 
  // ── RECEIPTS ──────────────────────────────────────────────
  RECEIPT:            `${BASE_URL}/shops/:shopId/payments/:paymentId/receipt`,
  RECEIPT_SEND:       `${BASE_URL}/shops/:shopId/payments/:paymentId/receipt/send`,
  RECEIPT_REGENERATE: `${BASE_URL}/shops/:shopId/payments/:paymentId/receipt/regenerate`,
 
  // ── PARTY ─────────────────────────────────────────────────
  PARTY_PAYMENTS:        `${BASE_URL}/shops/:shopId/payments/party/:partyId`,
  PARTY_PAYMENT_SUMMARY: `${BASE_URL}/shops/:shopId/payments/party/:partyId/summary`,
  CUSTOMER_PAYMENTS:     `${BASE_URL}/shops/:shopId/payments/customers/:customerId`,
  SUPPLIER_PAYMENTS:     `${BASE_URL}/shops/:shopId/payments/suppliers/:supplierId`,
 
  // ── MODE ANALYTICS ────────────────────────────────────────
  BY_MODE:            `${BASE_URL}/shops/:shopId/payments/by-mode`,
  CASH_COLLECTION:    `${BASE_URL}/shops/:shopId/payments/cash-collection`,
  DIGITAL_COLLECTION: `${BASE_URL}/shops/:shopId/payments/digital-collection`,
 
  // ── REPORTS & ANALYTICS ───────────────────────────────────
  ANALYTICS:         `${BASE_URL}/shops/:shopId/payments/analytics`,
  DASHBOARD:         `${BASE_URL}/shops/:shopId/payments/dashboard`,
  TODAY:             `${BASE_URL}/shops/:shopId/payments/today`,
  PENDING_PAYMENTS:  `${BASE_URL}/shops/:shopId/payments/pending`,
  FAILED_PAYMENTS:   `${BASE_URL}/shops/:shopId/payments/failed`,
 
  // ── REFERENCES ────────────────────────────────────────────
  SALE_PAYMENTS:     `${BASE_URL}/shops/:shopId/payments/reference/sale/:saleId`,
  PURCHASE_PAYMENTS: `${BASE_URL}/shops/:shopId/payments/reference/purchase/:purchaseId`,
 
  // ── SEARCH & FILTERS ──────────────────────────────────────
  SEARCH:          `${BASE_URL}/shops/:shopId/payments/search`,
  BY_DATE_RANGE:   `${BASE_URL}/shops/:shopId/payments/by-date-range`,
  BY_AMOUNT_RANGE: `${BASE_URL}/shops/:shopId/payments/by-amount-range`,
 
  // ── BULK ──────────────────────────────────────────────────
  BULK_RECONCILE:      `${BASE_URL}/shops/:shopId/payments/bulk-reconcile`,
  BULK_EXPORT:         `${BASE_URL}/shops/:shopId/payments/bulk-export`,
  BULK_PRINT_RECEIPTS: `${BASE_URL}/shops/:shopId/payments/bulk-print-receipts`,
 
  // ── APPROVAL ──────────────────────────────────────────────
  APPROVE: `${BASE_URL}/shops/:shopId/payments/:paymentId/approve`,
  REJECT:  `${BASE_URL}/shops/:shopId/payments/:paymentId/reject`,
 
  // ── REFUNDS ───────────────────────────────────────────────
  REFUND:  `${BASE_URL}/shops/:shopId/payments/:paymentId/refund`,
  REFUNDS: `${BASE_URL}/shops/:shopId/payments/refunds`,
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
  SHOPS: SHOP_ENDPOINTS,
  ORGANIZATIONS: ORGANIZATIONS_ENDPOINTS,
  USERS: USERS_ENDPOINTS,
  PRODUCTS: PRODUCT_ENDPOINTS,
  INVENTORY: INVENTORY_ENDPOINTS,
  CUSTOMERS: CUSTOMER_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
  SUPPLIER: SUPPLIER_ENDPOINTS,
  PURCHASE: PURCHASE_ENDPOINTS,
  SALE:SALE_ENDPOINTS,
  METAL:METAL_RATE_ENDPOINTS
}

export default API_ENDPOINTS
