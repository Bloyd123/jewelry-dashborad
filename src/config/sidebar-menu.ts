// FILE: config/sidebar-menu.ts
// Sidebar Menu Configuration

import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  ShoppingBag,
  ListOrdered,
  ShoppingCart,
  Receipt,
  FileText,
  Wallet,
  Store,
  Package2,
  UserPlus,
  UserCheck,
  PackagePlus,
  Info,
  CreditCard,
  Building,
  Users,
  Building2,
  TrendingUp,
  Truck,
} from 'lucide-react'
import type { MenuItem } from '@/types/menu'
import { ROUTES } from '@/config/routes.config'
// MENU ITEMS FUNCTION (For i18n support)

export const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    title: t('sidebar.dashboard'),
    url: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    title: t('sidebar.registeruser'),
    url: ROUTES.addUser,
    icon: LayoutDashboard,
  },
  // {
  //   title: t('sidebar.stock'),
  //   url: ROUTES.stock,
  //   icon: Package,
  // },
  // {
  //   title: t('sidebar.payments'),
  //   icon: Wallet,
  //   items: [
  //     { title: t('sidebar.paymentHistory'), url: ROUTES.paymentHistory },
  //     { title: t('sidebar.paymentEntry'), url: ROUTES.paymentEntry },
  //   ],
  // },
  {
    title: t('sidebar.metalRates'),
    url: ROUTES.metalRates,
    icon: TrendingUp,
  },
  {
    title: t('sidebar.customers'),
    icon: Users,
    items: [
      {
        title: t('sidebar.addCustomer'),
        url: ROUTES.addCustomer,
        icon: UserPlus,
      },
      {
        title: t('sidebar.Allcustomer'),
        url: ROUTES.Allcustomer,
        icon: UserCheck,
      },
      {
        title: t('sidebar.customerdetail'),
        url: ROUTES.customerdetail,
        icon: Info,
      },
    ],
  },
  {
    title: t('sidebar.suppliers'),
    icon: Truck,
    items: [
      {
        title: t('sidebar.supplierdetails'),
        url: ROUTES.supplierdetails,
        icon: Info,
      },
      {
        title: t('sidebar.addSupplier'),
        url: ROUTES.addSupplier,
        icon: UserPlus,
      },
      {
        title: t('sidebar.supplierlist'),
        url: ROUTES.supplierlist,
        icon: ClipboardList,
      },
    ],
  },
  {
    title: t('sidebar.shops'),
    icon: Building2,
    items: [
      {
        title: t('sidebar.shopList'),
        url: ROUTES.shopList,
        icon: ClipboardList,
      },
      { title: t('sidebar.shopdetail'), url: ROUTES.shopdetail, icon: Info },
      { title: t('sidebar.addshop'), url: ROUTES.addshop, icon: Building },
    ],
  },
  {
    title: t('sidebar.products'),
    icon: Package2,
    items: [
      { title: t('sidebar.allProducts'), url: ROUTES.products, icon: Boxes },
      {
        title: t('sidebar.addProduct'),
        url: ROUTES.addProduct,
        icon: PackagePlus,
      },
      {
        title: t('sidebar.productdetail'),
        url: ROUTES.productdetail,
        icon: Info,
      },
    ],
  },
  {
    title: t('sidebar.purchases'),
    icon: ShoppingCart,
    items: [
      {
        title: t('sidebar.allPurchases'),
        url: ROUTES.purchases,
        icon: ListOrdered,
      },
      {
        title: t('sidebar.addPurchase'),
        url: ROUTES.addPurchase,
        icon: ShoppingBag,
      },
      // { title: t('sidebar.suppliers'), url: ROUTES.suppliers },
      // { title: t('sidebar.reports'), url: ROUTES.purchaseReports },
    ],
  },
  {
    title: t('sidebar.sales'),
    icon: Store,
    items: [
      { title: t('sidebar.allSales'), url: ROUTES.sales, icon: Receipt },
      { title: t('sidebar.addSale'), url: ROUTES.addSale, icon: ShoppingCart },
      {
        title: t('sidebar.detailsales'),
        url: ROUTES.detailsales,
        icon: FileText,
      },
      // { title: t('sidebar.reports'), url: ROUTES.salesReports },
    ],
  },
  {
    title: t('sidebar.payments'),
    icon: CreditCard,
    items: [
      {
        title: t('sidebar.addPayment'),
        url: ROUTES.addpayments,
        icon: CreditCard,
      },
      {
        title: t('sidebar.allpayments'),
        url: ROUTES.allpayments,
        icon: Wallet,
      },
    ],
  },

  // {
  //   title: t('sidebar.oldGold'),
  //   icon: Coins,
  //   items: [
  //     { title: t('sidebar.allOldGoldPurchases'), url: ROUTES.oldGoldPurchases },
  //     {
  //       title: t('sidebar.addOldGoldPurchase'),
  //       url: ROUTES.addOldGoldPurchase,
  //     },
  //   ],
  // },

  // {
  //   title: t('sidebar.customOrders'),
  //   icon: Wrench,
  //   items: [{ title: t('sidebar.allCustomOrders'), url: ROUTES.customOrders }],
  // },
]
