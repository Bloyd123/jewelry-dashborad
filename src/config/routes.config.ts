
// FILE: src/config/routes.config.ts
// Route Configuration with Permissions

import React from 'react'

import { ROUTE_PATHS, RouteMetadata } from '@/constants/routePaths';
import { lazy } from 'react';


// Lazy Loaded Components


// Auth Pages
const LoginPage = lazy(() => import('@/components/auth/login/pages'));
// const SignupPage = lazy(() => import('@/components/auth/Signp'));
const ForgotPasswordPage = lazy(() => import('@/components/auth/forgotpassword/pages'));
const ResetPasswordPage = lazy(() => import('@/components/auth/resetpassword/pages'));

// Dashboard
const Dashboard = lazy(() =>
  import('@/components/dashboard/pages').then(m => ({
    default: m.Dashboard,
  }))
)

// Customer Pages
const AddCustomerPage = lazy(() => import('@/pages/customer/AddCustomer'));
const AllCustomers = lazy(() =>
  import('@/pages/customer/Allcustomer').then(m => ({
    default: m.AllCustomers,
  }))
)
const CustomerDetailPage = lazy(() => import('@/pages/customer/page'));

// Shop Pages
const ShopListPage = lazy(() =>
  import('@/pages/shops/ShopsListPage').then(m => ({
    default: m.ShopListPage,
  }))
)
const AddShopPage = lazy(() => import('@/pages/shops/Addshop'));
const ShopDetailsPage = lazy(() => import('@/pages/shops/ShopDetailsPage'));

// Product Pages
const AddProduct = React.lazy(() =>
  import('@/pages/product/AddProduct').then(m => ({
    default: m.AddProduct,
  }))
)

const ProductTable = lazy(() =>
  import('@/components/products/ProductTable').then(m => ({
    default: m.ProductTable,
  }))
)
const ProductDetailsPage = lazy(() => import('@/pages/product/ProductDetailsPage/ProductDetailsPage'));

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
const SupplierDetailPage = lazy(() => import('@/components/supplier/SupplierDetailsPage/SupplierDetailsPage'));

// Purchase Pages
const PurchaseTable = lazy(() =>
  import('@/components/purchase/PurchaseTable').then(m => ({
    default: m.PurchaseTable,
  }))
)
const AddPurchasePage = lazy(() => import('@/pages/purchase/AddPurchase'));

// Sales Pages
const SalesTable = lazy(() =>
  import('@/components/sales/SalesTable').then(m => ({
    default: m.SalesTable,
  }))
)
const CreateSalePage = lazy(() => import('@/pages/sales/AddSales').then(m => ({ default: m.CreateSalePage })));
const EditSalePage = lazy(() => import('@/pages/sales/AddSales').then(m => ({ default: m.EditSalePage })));
const SalesDetailsPage = lazy(() => import('@/pages/sales/SalesDetails/SalesDetailsPage'));

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

// User Profile
const UserProfile = lazy(() => import('@/pages/user/page'));
const AddUser =lazy(()=>import('@/pages/user/AddUser'))

// Route Configurations


export interface RouteConfig extends RouteMetadata {
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  children?: RouteConfig[];
}

// Public Routes (No Authentication Required)
export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATHS.AUTH.LOGIN,
    element: LoginPage,
    requiresAuth: false,
    layout: 'auth',
    title: 'Login',
  },
  // {
  //   path: ROUTE_PATHS.AUTH.SIGNUP,
  //   element: SignupPage,
  //   requiresAuth: false,
  //   layout: 'auth',
  //   title: 'Sign Up',
  // },
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
];

// Protected Routes (Authentication Required)
export const protectedRoutes: RouteConfig[] = [
  // Dashboard
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: Dashboard,
    requiresAuth: true,
    permission: 'canViewDashboard',
    title: 'Dashboard',
  },

  // Customers
  {
    path: ROUTE_PATHS.CUSTOMERS.LIST,
    element: AllCustomers,
    requiresAuth: true,
    permission: 'canViewCustomers',
    title: 'Customers',
  },
  // Users

{
  path: ROUTE_PATHS.USERS.EDIT,
  element: AddUser,
  requiresAuth: true,
  permission: 'canEditUsers',
  title: 'Edit User',
},
{
  path: ROUTE_PATHS.USERS.ADD,
  element: AddUser,
  requiresAuth: true,
  permission: 'canCreateUsers',
  title: 'Add User',
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

  // Shops
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

  // Products
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

  // Suppliers
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

  // Purchases
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

  // Sales
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

  // Payments
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

  // Metal Rates
  {
    path: ROUTE_PATHS.METAL_RATES,
    element: MetalRatesDashboardPage,
    requiresAuth: true,
    permission: 'canGetCurrentRate',
    title: 'Metal Rates',
  },

  // User Profile
  {
    path: ROUTE_PATHS.USER_PROFILE,
    element: UserProfile,
    requiresAuth: true,
    title: 'Profile',
  },
];


// Legacy Routes Support (for backward compatibility)


export const ROUTES = {
  // Auth
  login: ROUTE_PATHS.AUTH.LOGIN,
  signup: ROUTE_PATHS.AUTH.SIGNUP,
  forgotPassword: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
  resetPassword: ROUTE_PATHS.AUTH.RESET_PASSWORD,

  // Main
  dashboard: ROUTE_PATHS.DASHBOARD,
   addUser: ROUTE_PATHS.USERS.ADD,
   editUser:ROUTE_PATHS.USERS.EDIT,

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
} as const;