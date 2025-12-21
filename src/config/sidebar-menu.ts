// ============================================================================
// FILE: config/sidebar-menu.ts
// Sidebar Menu Configuration
// ============================================================================

import {
  LayoutDashboard,
  Package,
  Wallet,
  ShoppingCart,
  Store,
  Coins,
  Package2,
  Wrench,
  Users, // ✅ Add
  Building2, // ✅ Add
  TrendingUp, // ✅ Add
  Truck, // ✅ Add
} from 'lucide-react'
import type { MenuItem } from '@/types/menu'
import { ROUTES } from '@/config/routes.config'
// ============================================================================
// MENU ITEMS FUNCTION (For i18n support)
// ============================================================================

export const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    title: t('sidebar.dashboard'),
    url: ROUTES.dashboard,
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
      { title: t('sidebar.addCustomer'), url: ROUTES.addCustomer },
      { title: t('sidebar.detailcustomer'), url: ROUTES.detailcustomer },
    ],
  },
  {
    title: t('sidebar.suppliers'),
    icon: Truck,
    items: [
      { title: t('sidebar.supplierdetails'), url: ROUTES.supplierdetails },
      { title: t('sidebar.addSupplier'), url: ROUTES.addSupplier },
      { title: t('sidebar.supplierlist'), url: ROUTES.supplierlist },
    ],
  },
  {
    title: t('sidebar.shops'),
    icon: Building2,
    items: [
      { title: t('sidebar.shopList'), url: ROUTES.shopList },
      { title: t('sidebar.shopdetail'), url: ROUTES.shopdetail },
    ],
  },
  // {
  //   title: t('sidebar.purchases'),
  //   icon: ShoppingCart,
  //   items: [
  //     { title: t('sidebar.allPurchases'), url: ROUTES.purchases },
  //     { title: t('sidebar.addPurchase'), url: ROUTES.addPurchase },
  //     { title: t('sidebar.suppliers'), url: ROUTES.suppliers },
  //     { title: t('sidebar.reports'), url: ROUTES.purchaseReports },
  //   ],
  // },
  // {
  //   title: t('sidebar.sales'),
  //   icon: Store,
  //   items: [
  //     { title: t('sidebar.allSales'), url: ROUTES.sales },
  //     { title: t('sidebar.addSale'), url: ROUTES.addSale },
  //     { title: t('sidebar.customers'), url: ROUTES.addcustomers },
  //     { title: t('sidebar.reports'), url: ROUTES.salesReports },
  //   ],
  // },
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
  //   title: t('sidebar.products'),
  //   icon: Package2,
  //   items: [
  //     { title: t('sidebar.allProducts'), url: ROUTES.products },
  //     { title: t('sidebar.addProduct'), url: ROUTES.addProduct },
  //   ],
  // },
  // {
  //   title: t('sidebar.customOrders'),
  //   icon: Wrench,
  //   items: [{ title: t('sidebar.allCustomOrders'), url: ROUTES.customOrders }],
  // },
]
