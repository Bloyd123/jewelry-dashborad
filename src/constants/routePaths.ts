// ============================================================================
// FILE: src/constants/routePaths.ts
// Frontend route paths configuration
// ============================================================================

/**
 * Authentication Routes
 */
export const AUTH_ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_SUPER_ADMIN: '/register/super-admin',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Auth actions
  LOGOUT: '/logout',
} as const;

/**
 * Dashboard Routes
 */
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  OVERVIEW: '/dashboard/overview',
  QUICK_ACTIONS: '/dashboard/quick-actions',
} as const;

/**
 * Sales Routes
 */
export const SALES_ROUTES = {
  LIST: '/sales',
  CREATE: '/sales/create',
  DETAILS: (id: string) => `/sales/${id}`,
  EDIT: (id: string) => `/sales/${id}/edit`,
  INVOICE: (id: string) => `/sales/${id}/invoice`,
  PAYMENTS: (id: string) => `/sales/${id}/payments`,
  RETURNS: '/sales/returns',
  RETURN_DETAILS: (id: string) => `/sales/returns/${id}`,
} as const;

/**
 * Purchase Routes
 */
export const PURCHASE_ROUTES = {
  LIST: '/purchases',
  CREATE: '/purchases/create',
  DETAILS: (id: string) => `/purchases/${id}`,
  EDIT: (id: string) => `/purchases/${id}/edit`,
  PAYMENTS: (id: string) => `/purchases/${id}/payments`,
  RETURNS: '/purchases/returns',
  RETURN_DETAILS: (id: string) => `/purchases/returns/${id}`,
} as const;

/**
 * Inventory/Stock Routes
 */
export const INVENTORY_ROUTES = {
  OVERVIEW: '/inventory',
  PRODUCTS: '/inventory/products',
  PRODUCT_DETAILS: (id: string) => `/inventory/products/${id}`,
  PRODUCT_CREATE: '/inventory/products/create',
  PRODUCT_EDIT: (id: string) => `/inventory/products/${id}/edit`,
  
  LOW_STOCK: '/inventory/low-stock',
  STOCK_ADJUSTMENT: '/inventory/adjust',
  STOCK_TRANSFER: '/inventory/transfer',
  STOCK_VALUATION: '/inventory/valuation',
  STOCK_HISTORY: (id: string) => `/inventory/products/${id}/history`,
} as const;

/**
 * Parties Routes (Customers & Suppliers)
 */
export const PARTY_ROUTES = {
  // Customers
  CUSTOMERS: '/parties/customers',
  CUSTOMER_CREATE: '/parties/customers/create',
  CUSTOMER_DETAILS: (id: string) => `/parties/customers/${id}`,
  CUSTOMER_EDIT: (id: string) => `/parties/customers/${id}/edit`,
  CUSTOMER_LEDGER: (id: string) => `/parties/customers/${id}/ledger`,
  CUSTOMER_ORDERS: (id: string) => `/parties/customers/${id}/orders`,
  CUSTOMER_SCHEMES: (id: string) => `/parties/customers/${id}/schemes`,
  
  // Suppliers
  SUPPLIERS: '/parties/suppliers',
  SUPPLIER_CREATE: '/parties/suppliers/create',
  SUPPLIER_DETAILS: (id: string) => `/parties/suppliers/${id}`,
  SUPPLIER_EDIT: (id: string) => `/parties/suppliers/${id}/edit`,
  SUPPLIER_LEDGER: (id: string) => `/parties/suppliers/${id}/ledger`,
  SUPPLIER_PURCHASES: (id: string) => `/parties/suppliers/${id}/purchases`,
  
  // All parties list
  ALL: '/parties',
} as const;

/**
 * Orders Routes
 */
export const ORDER_ROUTES = {
  LIST: '/orders',
  CREATE: '/orders/create',
  DETAILS: (id: string) => `/orders/${id}`,
  EDIT: (id: string) => `/orders/${id}/edit`,
  TRACK: (id: string) => `/orders/${id}/track`,
} as const;

/**
 * Scheme Routes (Jewelry schemes)
 */
export const SCHEME_ROUTES = {
  LIST: '/schemes',
  CREATE: '/schemes/create',
  DETAILS: (id: string) => `/schemes/${id}`,
  EDIT: (id: string) => `/schemes/${id}/edit`,
  INSTALLMENTS: (id: string) => `/schemes/${id}/installments`,
  CLOSE: (id: string) => `/schemes/${id}/close`,
} as const;

/**
 * Masters Routes (Master Data)
 */
export const MASTER_ROUTES = {
  INDEX: '/masters',
  
  // Metal Rates
  METAL_RATES: '/masters/metal-rates',
  METAL_RATE_HISTORY: '/masters/metal-rates/history',
  
  // Product Masters
  CATEGORIES: '/masters/categories',
  PURITIES: '/masters/purities',
  MAKING_CHARGES: '/masters/making-charges',
  
  // Tax & GST
  TAX_RATES: '/masters/tax-rates',
  GST_SETTINGS: '/masters/gst-settings',
  
  // Other Masters
  PAYMENT_METHODS: '/masters/payment-methods',
  UNITS: '/masters/units',
} as const;

/**
 * Reports Routes
 */
export const REPORT_ROUTES = {
  DASHBOARD: '/reports',
  
  // Sales Reports
  SALES_SUMMARY: '/reports/sales/summary',
  SALES_BY_CATEGORY: '/reports/sales/by-category',
  SALES_BY_CUSTOMER: '/reports/sales/by-customer',
  SALES_BY_PRODUCT: '/reports/sales/by-product',
  DAILY_SALES: '/reports/sales/daily',
  MONTHLY_SALES: '/reports/sales/monthly',
  
  // Purchase Reports
  PURCHASE_SUMMARY: '/reports/purchases/summary',
  PURCHASE_BY_SUPPLIER: '/reports/purchases/by-supplier',
  
  // Inventory Reports
  INVENTORY_SUMMARY: '/reports/inventory/summary',
  STOCK_VALUATION: '/reports/inventory/valuation',
  STOCK_REGISTER: '/reports/inventory/register',
  LOW_STOCK_REPORT: '/reports/inventory/low-stock',
  
  // Financial Reports
  PROFIT_LOSS: '/reports/financial/profit-loss',
  BALANCE_SHEET: '/reports/financial/balance-sheet',
  CASH_FLOW: '/reports/financial/cash-flow',
  DAY_BOOK: '/reports/financial/day-book',
  
  // GST Reports
  GST_SUMMARY: '/reports/gst/summary',
  GST_RETURN: '/reports/gst/return',
  GST_FILING: '/reports/gst/filing',
  
  // Party Reports
  PARTY_LEDGER: '/reports/parties/ledger',
  OUTSTANDING: '/reports/parties/outstanding',
  PARTY_STATEMENT: (id: string) => `/reports/parties/${id}/statement`,
  
  // Custom Reports
  CUSTOM: '/reports/custom',
  CUSTOM_CREATE: '/reports/custom/create',
} as const;

/**
 * Payment Routes
 */
export const PAYMENT_ROUTES = {
  LIST: '/payments',
  CREATE: '/payments/create',
  DETAILS: (id: string) => `/payments/${id}`,
  RECEIPT: (id: string) => `/payments/${id}/receipt`,
} as const;

/**
 * Settings Routes
 */
export const SETTINGS_ROUTES = {
  INDEX: '/settings',
  
  // User Management
  USERS: '/settings/users',
  USER_CREATE: '/settings/users/create',
  USER_DETAILS: (id: string) => `/settings/users/${id}`,
  USER_EDIT: (id: string) => `/settings/users/${id}/edit`,
  
  // Roles & Permissions
  ROLES: '/settings/roles',
  PERMISSIONS: '/settings/permissions',
  
  // Shop Settings
  SHOP_PROFILE: '/settings/shop/profile',
  SHOP_BRANCHES: '/settings/shop/branches',
  SHOP_BRANCH_CREATE: '/settings/shop/branches/create',
  SHOP_BRANCH_EDIT: (id: string) => `/settings/shop/branches/${id}/edit`,
  
  // Organization Settings (for org_admin)
  ORG_PROFILE: '/settings/organization/profile',
  ORG_SUBSCRIPTION: '/settings/organization/subscription',
  ORG_BILLING: '/settings/organization/billing',
  ORG_SHOPS: '/settings/organization/shops',
  
  // Billing Settings
  BILLING: '/settings/billing',
  INVOICE_SETTINGS: '/settings/billing/invoice',
  RECEIPT_SETTINGS: '/settings/billing/receipt',
  
  // System Settings
  SYSTEM: '/settings/system',
  INTEGRATIONS: '/settings/integrations',
  BACKUP: '/settings/backup',
  ACTIVITY_LOG: '/settings/activity-log',
  
  // User Profile
  PROFILE: '/settings/profile',
  CHANGE_PASSWORD: '/settings/profile/change-password',
  PREFERENCES: '/settings/profile/preferences',
  SESSIONS: '/settings/profile/sessions',
} as const;

/**
 * Organization Routes (for super_admin)
 */
export const ORGANIZATION_ROUTES = {
  LIST: '/organizations',
  CREATE: '/organizations/create',
  DETAILS: (id: string) => `/organizations/${id}`,
  EDIT: (id: string) => `/organizations/${id}/edit`,
  SHOPS: (id: string) => `/organizations/${id}/shops`,
  USERS: (id: string) => `/organizations/${id}/users`,
  SUBSCRIPTION: (id: string) => `/organizations/${id}/subscription`,
  STATS: (id: string) => `/organizations/${id}/stats`,
} as const;

/**
 * Shop Routes (for org_admin)
 */
export const SHOP_ROUTES = {
  LIST: '/shops',
  CREATE: '/shops/create',
  DETAILS: (id: string) => `/shops/${id}`,
  EDIT: (id: string) => `/shops/${id}/edit`,
  USERS: (id: string) => `/shops/${id}/users`,
  INVENTORY: (id: string) => `/shops/${id}/inventory`,
  STATS: (id: string) => `/shops/${id}/stats`,
} as const;

/**
 * Notification Routes
 */
export const NOTIFICATION_ROUTES = {
  LIST: '/notifications',
  DETAILS: (id: string) => `/notifications/${id}`,
} as const;

/**
 * Help & Support Routes
 */
export const SUPPORT_ROUTES = {
  HELP: '/help',
  FAQ: '/help/faq',
  CONTACT: '/help/contact',
  TUTORIALS: '/help/tutorials',
  DOCUMENTATION: '/help/docs',
} as const;

/**
 * Error Routes
 */
export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance',
} as const;

/**
 * Public Routes
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// ============================================================================
// ROUTE GROUPS (for easy access)
// ============================================================================

/**
 * All authentication routes (no login required)
 */
export const PUBLIC_AUTH_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.REGISTER_SUPER_ADMIN,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
] as const;

/**
 * Routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/sales',
  '/purchases',
  '/inventory',
  '/parties',
  '/orders',
  '/schemes',
  '/masters',
  '/reports',
  '/payments',
  '/settings',
  '/organizations',
  '/shops',
  '/notifications',
] as const;

/**
 * Admin only routes (org_admin, super_admin)
 */
export const ADMIN_ONLY_ROUTES = [
  SETTINGS_ROUTES.USERS,
  SETTINGS_ROUTES.ROLES,
  SETTINGS_ROUTES.ORG_PROFILE,
  ORGANIZATION_ROUTES.LIST,
] as const;

/**
 * Super Admin only routes
 */
export const SUPER_ADMIN_ROUTES = [
  ORGANIZATION_ROUTES.LIST,
  ORGANIZATION_ROUTES.CREATE,
] as const;

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

/**
 * All routes in a single object
 */
export const ROUTES = {
  AUTH: AUTH_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES,
  SALES: SALES_ROUTES,
  PURCHASE: PURCHASE_ROUTES,
  INVENTORY: INVENTORY_ROUTES,
  PARTY: PARTY_ROUTES,
  ORDER: ORDER_ROUTES,
  SCHEME: SCHEME_ROUTES,
  MASTER: MASTER_ROUTES,
  REPORT: REPORT_ROUTES,
  PAYMENT: PAYMENT_ROUTES,
  SETTINGS: SETTINGS_ROUTES,
  ORGANIZATION: ORGANIZATION_ROUTES,
  SHOP: SHOP_ROUTES,
  NOTIFICATION: NOTIFICATION_ROUTES,
  SUPPORT: SUPPORT_ROUTES,
  ERROR: ERROR_ROUTES,
  PUBLIC: PUBLIC_ROUTES,
} as const;

/**
 * Check if route is public (no auth required)
 */
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_AUTH_ROUTES.some(route => path.startsWith(route));
};

/**
 * Check if route is protected (auth required)
 */
export const isProtectedRoute = (path: string): boolean => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

/**
 * Check if route is admin only
 */
export const isAdminRoute = (path: string): boolean => {
  return ADMIN_ONLY_ROUTES.some(route => path.startsWith(route));
};

/**
 * Check if route is super admin only
 */
export const isSuperAdminRoute = (path: string): boolean => {
  return SUPER_ADMIN_ROUTES.some(route => path.startsWith(route));
};

/**
 * Get breadcrumb path for route
 */
export const getBreadcrumbs = (path: string): { label: string; path: string }[] => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [
    { label: 'Home', path: '/' },
  ];

  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: currentPath,
    });
  });

  return breadcrumbs;
};

/**
 * Get parent route
 */
export const getParentRoute = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  segments.pop();
  return segments.length > 0 ? `/${segments.join('/')}` : '/';
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type DashboardRoute = (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];
export type SalesRoute = (typeof SALES_ROUTES)[keyof typeof SALES_ROUTES];
export type PurchaseRoute = (typeof PURCHASE_ROUTES)[keyof typeof PURCHASE_ROUTES];
export type InventoryRoute = (typeof INVENTORY_ROUTES)[keyof typeof INVENTORY_ROUTES];
export type PartyRoute = (typeof PARTY_ROUTES)[keyof typeof PARTY_ROUTES];
export type SettingsRoute = (typeof SETTINGS_ROUTES)[keyof typeof SETTINGS_ROUTES];

export type AllRoutes = 
  | AuthRoute 
  | DashboardRoute 
  | SalesRoute 
  | PurchaseRoute 
  | InventoryRoute 
  | PartyRoute 
  | SettingsRoute
  | string; // For dynamic routes

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ROUTES;