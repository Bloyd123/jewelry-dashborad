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
} from 'lucide-react'
import type { MenuItem } from '@/types/menu'

// ============================================================================
// MENU ITEMS FUNCTION (For i18n support)
// ============================================================================

export const getMenuItems = (t: (key: string) => string): MenuItem[] => [
  {
    title: t('sidebar.dashboard'),
    url: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    title: t('sidebar.stock'),
    url: 'stock',
    icon: Package,
  },
  {
    title: t('sidebar.payments'),
    icon: Wallet,
    items: [
      { title: t('sidebar.paymentHistory'), url: 'payments/history' },
      { title: t('sidebar.paymentEntry'), url: 'payments/entry' },
    ],
  },
  {
    title: t('sidebar.purchases'),
    icon: ShoppingCart,
    items: [
      { title: t('sidebar.allPurchases'), url: 'purchases' },
      { title: t('sidebar.addPurchase'), url: 'purchases/add' },
      { title: t('sidebar.suppliers'), url: 'suppliers' },
      { title: t('sidebar.reports'), url: 'purchases/reports' },
    ],
  },
  {
    title: t('sidebar.sales'),
    icon: Store,
    items: [
      { title: t('sidebar.allSales'), url: 'sales' },
      { title: t('sidebar.addSale'), url: 'sales/add' },
      { title: t('sidebar.customers'), url: 'customers' },
      { title: t('sidebar.reports'), url: 'sales/reports' },
    ],
  },
  {
    title: t('sidebar.oldGold'),
    icon: Coins,
    items: [
      { title: t('sidebar.allOldGoldPurchases'), url: 'purchases/old-gold' },
      { title: t('sidebar.addOldGoldPurchase'), url: 'purchases/old-gold/add' },
    ],
  },
  {
    title: t('sidebar.products'),
    icon: Package2,
    items: [
      { title: t('sidebar.allProducts'), url: 'products' },
      { title: t('sidebar.addProduct'), url: 'products/add' },
    ],
  },
  {
    title: t('sidebar.customOrders'),
    icon: Wrench,
    items: [{ title: t('sidebar.allCustomOrders'), url: 'custom-orders' }],
  },
]

// ============================================================================
// STATIC VERSION (If no i18n)
// ============================================================================

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Stock',
    url: 'stock',
    icon: Package,
  },
  // ... rest
]