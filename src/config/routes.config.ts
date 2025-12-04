// ============================================================================
// FILE: config/routes.config.ts
// ============================================================================

export const ROUTES = {
  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  
  // Main
  dashboard: '/dashboard',
  stock: '/stock',
  
  // Payments
  payments: '/payments',
  paymentHistory: '/payments/history',
  paymentEntry: '/payments/entry',
  
  // Purchases
  purchases: '/purchases',
  addPurchase: '/purchases/add',
  suppliers: '/suppliers',
  purchaseReports: '/purchases/reports',
  
  // Sales
  sales: '/sales',
  addSale: '/sales/add',
  customers: '/customers',
  salesReports: '/sales/reports',
  
  // Old Gold
  oldGoldPurchases: '/purchases/old-gold',
  addOldGoldPurchase: '/purchases/old-gold/add',
  
  // Products
  products: '/products',
  addProduct: '/products/add',
  
  // Custom Orders
  customOrders: '/custom-orders',
} as const