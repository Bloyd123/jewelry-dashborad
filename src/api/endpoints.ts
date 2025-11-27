// ============================================================================
// FILE: src/api/endpoints.ts
// API Endpoints Configuration
// ============================================================================

const API_BASE = '/api';
const API_VERSION = '/v1';
const BASE_URL = `${API_BASE}${API_VERSION}`;

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

const AUTH_BASE = `${BASE_URL}/auth`;

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
  REVOKE_SESSION: (tokenId: string) => `${AUTH_BASE}/sessions/${tokenId}`
};

// ============================================================================
// SHOP ENDPOINTS
// ============================================================================

const SHOPS_BASE = `${BASE_URL}/shops`;

export const SHOPS_ENDPOINTS = {
  BASE: SHOPS_BASE,
  BY_ID: `${SHOPS_BASE}/:id`,
  SETTINGS: `${SHOPS_BASE}/:id/settings`,
  METAL_RATES: `${SHOPS_BASE}/:id/metal-rates`,
  STATISTICS: `${SHOPS_BASE}/:id/statistics`,
  TRANSFER_INVENTORY: `${SHOPS_BASE}/:id/transfer-inventory`,
};

// ============================================================================
// ORGANIZATION ENDPOINTS
// ============================================================================

const ORGANIZATIONS_BASE = `${BASE_URL}/organizations`;

export const ORGANIZATIONS_ENDPOINTS = {
  BASE: ORGANIZATIONS_BASE,
  BY_ID: `${ORGANIZATIONS_BASE}/:id`,
  USERS: `${ORGANIZATIONS_BASE}/:id/users`,
  SHOPS: `${ORGANIZATIONS_BASE}/:id/shops`,
  STATISTICS: `${ORGANIZATIONS_BASE}/:id/statistics`,
  SUBSCRIPTION: `${ORGANIZATIONS_BASE}/:id/subscription`,
};

// ============================================================================
// USER ENDPOINTS
// ============================================================================

const USERS_BASE = `${BASE_URL}/users`;

export const USERS_ENDPOINTS = {
  BASE: USERS_BASE,
  BY_ID: `${USERS_BASE}/:id`,
  ACTIVATE: `${USERS_BASE}/:id/activate`,
  DEACTIVATE: `${USERS_BASE}/:id/deactivate`,
  RESET_PASSWORD: `${USERS_BASE}/:id/reset-password`,
  UPDATE_ROLE: `${USERS_BASE}/:id/role`,
  PERMISSIONS: `${USERS_BASE}/:id/permissions`,
  SHOP_ACCESS: `${USERS_BASE}/:id/shop-access`,
};

// ============================================================================
// PRODUCT ENDPOINTS
// ============================================================================

const PRODUCTS_BASE = `${BASE_URL}/products`;

export const PRODUCTS_ENDPOINTS = {
  BASE: PRODUCTS_BASE,
  BY_ID: `${PRODUCTS_BASE}/:id`,
  BULK_UPLOAD: `${PRODUCTS_BASE}/bulk-upload`,
  EXPORT: `${PRODUCTS_BASE}/export`,
  CATEGORIES: `${PRODUCTS_BASE}/categories`,
  TAGS: `${PRODUCTS_BASE}/tags`,
};

// ============================================================================
// INVENTORY ENDPOINTS
// ============================================================================

const INVENTORY_BASE = `${BASE_URL}/inventory`;

export const INVENTORY_ENDPOINTS = {
  BASE: INVENTORY_BASE,
  BY_ID: `${INVENTORY_BASE}/:id`,
  STOCK_IN: `${INVENTORY_BASE}/stock-in`,
  STOCK_OUT: `${INVENTORY_BASE}/stock-out`,
  TRANSFER: `${INVENTORY_BASE}/transfer`,
  ADJUSTMENT: `${INVENTORY_BASE}/adjustment`,
  HISTORY: `${INVENTORY_BASE}/:id/history`,
};

// ============================================================================
// SALES ENDPOINTS
// ============================================================================

const SALES_BASE = `${BASE_URL}/sales`;

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
};

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================

const CUSTOMERS_BASE = `${BASE_URL}/customers`;

export const CUSTOMERS_ENDPOINTS = {
  BASE: CUSTOMERS_BASE,
  BY_ID: `${CUSTOMERS_BASE}/:id`,
  ORDERS: `${CUSTOMERS_BASE}/:id/orders`,
  TRANSACTIONS: `${CUSTOMERS_BASE}/:id/transactions`,
  LOYALTY: `${CUSTOMERS_BASE}/:id/loyalty`,
};

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

const REPORTS_BASE = `${BASE_URL}/reports`;

export const REPORTS_ENDPOINTS = {
  SALES: `${REPORTS_BASE}/sales`,
  INVENTORY: `${REPORTS_BASE}/inventory`,
  CUSTOMERS: `${REPORTS_BASE}/customers`,
  FINANCIAL: `${REPORTS_BASE}/financial`,
  PRODUCT_PERFORMANCE: `${REPORTS_BASE}/product-performance`,
  DASHBOARD: `${REPORTS_BASE}/dashboard`,
};

// ============================================================================
// CONSOLIDATED EXPORT
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  SHOPS: SHOPS_ENDPOINTS,
  ORGANIZATIONS: ORGANIZATIONS_ENDPOINTS,
  USERS: USERS_ENDPOINTS,
  PRODUCTS: PRODUCTS_ENDPOINTS,
  INVENTORY: INVENTORY_ENDPOINTS,
  SALES: SALES_ENDPOINTS,
  CUSTOMERS: CUSTOMERS_ENDPOINTS,
  REPORTS: REPORTS_ENDPOINTS,
};

export default API_ENDPOINTS;