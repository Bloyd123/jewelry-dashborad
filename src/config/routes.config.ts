// ============================================================================
// FILE: config/routes.config.ts
// ============================================================================

export const ROUTES = {
  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  signup:'/signup',
  
  // Main
  dashboard: '/dashboard',
  stock: '/stock',
  
  // Payments
  addpayments: '/payments/add',
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
  addcustomers: '/customers/add',
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

  //Customer
  addCustomer:'/customers/add',
  detailcustomer: '/customerdetail',

  // supplier
  supplierdetails:'/supplierdetails',
  addSupplier:'/supplier/add',
  supplierlist:'/supplierlist',

  //Shop
  shopList:'/shops',
  shopdetail:'/shops/:id',

  // Metal Rate
  metalRates:'/metal-rates'

} as const