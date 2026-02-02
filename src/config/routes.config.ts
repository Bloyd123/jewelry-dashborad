// 
// FILE: src/config/routes.config.ts
// Route Configuration with Permissions - FULLY TYPED
// 

import React, { lazy } from 'react'
import { ROUTE_PATHS, RouteMetadata } from '@/constants/routePaths'
import type { PermissionKey, UserRole } from '@/types'

// 
// LAZY LOADED COMPONENTS
// 

// Auth Pages
const LoginPage = lazy(() => import('@/components/auth/login/pages'))
const ForgotPasswordPage = lazy(() => import('@/components/auth/forgotpassword/pages'))
const ResetPasswordPage = lazy(() => import('@/components/auth/resetpassword/pages'))
const VerifyEmail = lazy(() => import('@/pages/user/AddUser/VerifyEmail'))
const ResendVerification = lazy(() => import('@/pages/user/AddUser/ResendVerification'))
const VerificationSuccess = lazy(() => import('@/pages/user/AddUser/VerificationSuccess'))

// Dashboard
const Dashboard = lazy(() =>
  import('@/components/dashboard/pages').then(m => ({
    default: m.Dashboard,
  }))
)

// Customer Pages
const AddCustomerPage = lazy(() => import('@/pages/customer/AddCustomer'))
const AllCustomers = lazy(() =>
  import('@/pages/customer/Allcustomer').then(m => ({
    default: m.AllCustomers,
  }))
)
const CustomerDetailPage = lazy(() => import('@/pages/customer/CustomerDetail/page'))

// Shop Pages
const ShopListPage = lazy(() =>
  import('@/pages/shops/ShopsListPage').then(m => ({
    default: m.ShopListPage,
  }))
)
const AddShopPage = lazy(() => import('@/pages/shops/Addshop'))
const ShopDetailsPage = lazy(() => import('@/pages/shops/ShopDetailsPage'))

// Product Pages
const AddProduct = lazy(() =>
  import('@/pages/product/AddProduct').then(m => ({
    default: m.AddProduct,
  }))
)
const ProductTable = lazy(() =>
  import('@/components/products/ProductTable').then(m => ({
    default: m.ProductTable,
  }))
)
const ProductDetailsPage = lazy(() => 
  import('@/pages/product/ProductDetailsPage/ProductDetailsPage')
)

// Supplier Pages
const SupplierTable = lazy(() =>
  import('@/components/supplier/SupplierTable').then(m => ({
    default: m.SupplierTable,
  }))
)
const AddSupplier = lazy(() =>
  import('@/pages/suppliers/AddSupplier').then(m => ({
    default: m.AddSupplier,
  }))
)
const SupplierDetailPage = lazy(() => 
  import('@/components/supplier/SupplierDetailsPage/SupplierDetailsPage')
)

// Purchase Pages
const PurchaseTable = lazy(() =>
  import('@/components/purchase/PurchaseTable').then(m => ({
    default: m.PurchaseTable,
  }))
)
const AddPurchasePage = lazy(() => import('@/pages/purchase/AddPurchase'))

// Sales Pages
const SalesTable = lazy(() =>
  import('@/components/sales/SalesTable').then(m => ({
    default: m.SalesTable,
  }))
)
const CreateSalePage = lazy(() => 
  import('@/pages/sales/AddSales').then(m => ({ default: m.CreateSalePage }))
)
const EditSalePage = lazy(() => 
  import('@/pages/sales/AddSales').then(m => ({ default: m.EditSalePage }))
)
const SalesDetailsPage = lazy(() => import('@/pages/sales/SalesDetails/SalesDetailsPage'))

// Payment Pages
const PaymentFormPage = lazy(() =>
  import('@/pages/payment/PaymentFormPage').then(m => ({
    default: m.PaymentFormPage,
  }))
)
const PaymentTable = lazy(() =>
  import('@/components/payments/PaymentTable').then(m => ({
    default: m.PaymentTable,
  }))
)

// Metal Rates
const MetalRatesDashboardPage = lazy(() =>
  import('@/pages/metal-rates/MetalRatesDashboard').then(m => ({
    default: m.MetalRatesDashboardPage,
  }))
)

// User Pages
const UserProfile = lazy(() => import('@/pages/user/page'))
const AddUser = lazy(() => import('@/pages/user/AddUser'))

// 
// ROUTE CONFIG INTERFACE - Enhanced with proper types
// 

export interface RouteConfig extends RouteMetadata {
  element: React.LazyExoticComponent<React.ComponentType<any>>
  children?: RouteConfig[]
  
  //  Enhanced with proper types
  permission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAll?: boolean
}

// 
// PUBLIC ROUTES (No Authentication Required)
// 

export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.AUTH.LOGIN,
    element: LoginPage,
    requiresAuth: false,
    layout: 'auth',
    title: 'Login',
  },
  {
    path: ROUTE_PATHS.AUTH.VERIFY_EMAIL,
    element: VerifyEmail,
    requiresAuth: false,
    layout: 'auth',
    title: 'Verify Email',
  },
  {
    path: ROUTE_PATHS.AUTH.RESEND_VERIFICATION,
    element: ResendVerification,
    requiresAuth: false,
    layout: 'auth',
    title: 'Resend Verification',
  },
  {
    path: ROUTE_PATHS.AUTH.VERIFICATION_SUCCESS,
    element: VerificationSuccess,
    requiresAuth: false,
    layout: 'auth',
    title: 'Verification Successful',
  },
  {
    path: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
    element: ForgotPasswordPage,
    requiresAuth: false,
    layout: 'auth',
    title: 'Forgot Password',
  },
  {
    path: ROUTE_PATHS.AUTH.RESET_PASSWORD,
    element: ResetPasswordPage,
    requiresAuth: false,
    layout: 'auth',
    title: 'Reset Password',
  },
]

// 
// PROTECTED ROUTES (Authentication Required)
// 

export const protectedRoutes: RouteConfig[] = [
  // 
  // DASHBOARD
  // 
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: Dashboard,
    requiresAuth: true,
    permission: 'canViewDashboard',
    title: 'Dashboard',
  },

  // 
  // USERS
  // 
  {
    path: ROUTE_PATHS.USERS.ADD,
    element: AddUser,
    requiresAuth: true,
    permission: 'canCreateUsers',
    title: 'Add User',
  },
  {
    path: ROUTE_PATHS.USERS.EDIT,
    element: AddUser,
    requiresAuth: true,
    permission: 'canEditUsers',
    title: 'Edit User',
  },

  // 
  // CUSTOMERS
  // 
  {
    path: ROUTE_PATHS.CUSTOMERS.LIST,
    element: AllCustomers,
    requiresAuth: true,
    permission: 'canViewCustomers',
    title: 'Customers',
  },
  {
    path: ROUTE_PATHS.CUSTOMERS.ADD,
    element: AddCustomerPage,
    requiresAuth: true,
    permission: 'canCreateCustomer',
    title: 'Add Customer',
  },
  {
    path: ROUTE_PATHS.CUSTOMERS.EDIT,
    element: AddCustomerPage,
    requiresAuth: true,
    permission: 'canUpdateCustomer',
    title: 'Edit Customer',
  },
  {
    path: ROUTE_PATHS.CUSTOMERS.DETAIL,
    element: CustomerDetailPage,
    requiresAuth: true,
    permission: 'canGetSingleCustomer',
    title: 'Customer Details',
  },

  // 
  // SHOPS
  // 
  {
    path: ROUTE_PATHS.SHOPS.LIST,
    element: ShopListPage,
    requiresAuth: true,
    permission: 'canViewShops',
    title: 'Shops',
  },
  {
    path: ROUTE_PATHS.SHOPS.ADD,
    element: AddShopPage,
    requiresAuth: true,
    permission: 'canCreateShop',
    title: 'Add Shop',
  },
  {
    path: ROUTE_PATHS.SHOPS.EDIT,
    element: AddShopPage,
    requiresAuth: true,
    permission: 'canUpdateShop',
    title: 'Edit Shop',
  },
  {
    path: ROUTE_PATHS.SHOPS.DETAIL,
    element: ShopDetailsPage,
    requiresAuth: true,
    permission: 'canViewSingleShop',
    title: 'Shop Details',
  },

  // 
  // PRODUCTS
  // 
  {
    path: ROUTE_PATHS.PRODUCTS.LIST,
    element: ProductTable,
    requiresAuth: true,
    permission: 'canViewProducts',
    title: 'Products',
  },
  {
    path: ROUTE_PATHS.PRODUCTS.ADD,
    element: AddProduct,
    requiresAuth: true,
    permission: 'canCreateProduct',
    title: 'Add Product',
  },
  {
    path: ROUTE_PATHS.PRODUCTS.EDIT,
    element: AddProduct,
    requiresAuth: true,
    permission: 'canUpdateProduct',
    title: 'Edit Product',
  },
  {
    path: ROUTE_PATHS.PRODUCTS.DETAIL,
    element: ProductDetailsPage,
    requiresAuth: true,
    permission: 'canGetSingleProduct',
    title: 'Product Details',
  },

  // 
  // SUPPLIERS
  // 
  {
    path: ROUTE_PATHS.SUPPLIERS.LIST,
    element: SupplierTable,
    requiresAuth: true,
    permission: 'canViewSuppliers',
    title: 'Suppliers',
  },
  {
    path: ROUTE_PATHS.SUPPLIERS.ADD,
    element: AddSupplier,
    requiresAuth: true,
    permission: 'canCreateSupplier',
    title: 'Add Supplier',
  },
  {
    path: ROUTE_PATHS.SUPPLIERS.EDIT,
    element: AddSupplier,
    requiresAuth: true,
    permission: 'canUpdateSupplier',
    title: 'Edit Supplier',
  },
  {
    path: ROUTE_PATHS.SUPPLIERS.DETAIL,
    element: SupplierDetailPage,
    requiresAuth: true,
    permission: 'canGetSingleSupplier',
    title: 'Supplier Details',
  },

  // 
  // PURCHASES
  // 
  {
    path: ROUTE_PATHS.PURCHASES.LIST,
    element: PurchaseTable,
    requiresAuth: true,
    permission: 'canViewPurchases',
    title: 'Purchases',
  },
  {
    path: ROUTE_PATHS.PURCHASES.ADD,
    element: AddPurchasePage,
    requiresAuth: true,
    permission: 'canCreatePurchase',
    title: 'Add Purchase',
  },
  {
    path: ROUTE_PATHS.PURCHASES.EDIT,
    element: AddPurchasePage,
    requiresAuth: true,
    permission: 'canUpdatePurchase',
    title: 'Edit Purchase',
  },

  // 
  // SALES
  // 
  {
    path: ROUTE_PATHS.SALES.LIST,
    element: SalesTable,
    requiresAuth: true,
    permission: 'canViewSales',
    title: 'Sales',
  },
  {
    path: ROUTE_PATHS.SALES.ADD,
    element: CreateSalePage,
    requiresAuth: true,
    permission: 'canCreateSale',
    title: 'Add Sale',
  },
  {
    path: ROUTE_PATHS.SALES.EDIT,
    element: EditSalePage,
    requiresAuth: true,
    permission: 'canUpdateSale',
    title: 'Edit Sale',
  },
  {
    path: ROUTE_PATHS.SALES.DETAIL,
    element: SalesDetailsPage,
    requiresAuth: true,
    permission: 'canGetSingleSale',
    title: 'Sale Details',
  },

  // 
  // PAYMENTS
  // 
  {
    path: ROUTE_PATHS.PAYMENTS.LIST,
    element: PaymentTable,
    requiresAuth: true,
    permission: 'canViewPayments',
    title: 'Payments',
  },
  {
    path: ROUTE_PATHS.PAYMENTS.ADD,
    element: PaymentFormPage,
    requiresAuth: true,
    permission: 'canCreatePayment',
    title: 'Add Payment',
  },

  // 
  // METAL RATES
  // 
  {
    path: ROUTE_PATHS.METAL_RATES,
    element: MetalRatesDashboardPage,
    requiresAuth: true,
    permission: 'canGetCurrentRate',
    title: 'Metal Rates',
  },

  // 
  // USER PROFILE
  // 
  {
    path: ROUTE_PATHS.USER_PROFILE,
    element: UserProfile,
    requiresAuth: true,
    title: 'Profile',
  },
]

// 
// LEGACY ROUTES SUPPORT (for backward compatibility)
// 

export const ROUTES = {
  // Auth
  login: ROUTE_PATHS.AUTH.LOGIN,
  signup: ROUTE_PATHS.AUTH.SIGNUP,
  forgotPassword: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
  resetPassword: ROUTE_PATHS.AUTH.RESET_PASSWORD,
  verifyEmail: ROUTE_PATHS.AUTH.VERIFY_EMAIL,
  resendVerification: ROUTE_PATHS.AUTH.RESEND_VERIFICATION,
  verificationSuccess: ROUTE_PATHS.AUTH.VERIFICATION_SUCCESS,

  // Main
  dashboard: ROUTE_PATHS.DASHBOARD,

  // Users
  addUser: ROUTE_PATHS.USERS.ADD,
  editUser: ROUTE_PATHS.USERS.EDIT,

  // Customers
  addCustomer: ROUTE_PATHS.CUSTOMERS.ADD,
  Allcustomer: ROUTE_PATHS.CUSTOMERS.LIST,
  customerdetail: ROUTE_PATHS.CUSTOMERS.DETAIL,

  // Shops
  shopList: ROUTE_PATHS.SHOPS.LIST,
  addshop: ROUTE_PATHS.SHOPS.ADD,
  shopdetail: ROUTE_PATHS.SHOPS.DETAIL,

  // Products
  products: ROUTE_PATHS.PRODUCTS.LIST,
  addProduct: ROUTE_PATHS.PRODUCTS.ADD,
  productdetail: ROUTE_PATHS.PRODUCTS.DETAIL,

  // Suppliers
  supplierlist: ROUTE_PATHS.SUPPLIERS.LIST,
  addSupplier: ROUTE_PATHS.SUPPLIERS.ADD,
  supplierdetails: ROUTE_PATHS.SUPPLIERS.DETAIL,

  // Purchases
  purchases: ROUTE_PATHS.PURCHASES.LIST,
  addPurchase: ROUTE_PATHS.PURCHASES.ADD,

  // Sales
  sales: ROUTE_PATHS.SALES.LIST,
  addSale: ROUTE_PATHS.SALES.ADD,
  detailsales: ROUTE_PATHS.SALES.DETAIL,

  // Payments
  addpayments: ROUTE_PATHS.PAYMENTS.ADD,
  allpayments: ROUTE_PATHS.PAYMENTS.LIST,

  // Metal Rates
  metalRates: ROUTE_PATHS.METAL_RATES,
} as const