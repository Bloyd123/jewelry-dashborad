// FILE: config/sidebar-menu.ts
import { buildRoute } from '@/constants/routePaths'
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
Bug ,
  Building2,
  TrendingUp,
  Truck,
  Gem,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react'
import type { MenuItem } from '@/types/menu'
import { ROUTES } from '@/config/routes.config'

export const getMenuItems = (t: (key: string) => string, shopId: string = ''): MenuItem[] => [
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
  {
    title: t('sidebar.metalRates'),
    url: ROUTES.metalRates,
    icon: TrendingUp,
  },
  {
    title: t('sidebar.openingBalance'),
    url: ROUTES.openingBalance,
    icon: Wallet,
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
      {
        title: t('sidebar.purchaseDetail'),
        url: ROUTES.purchaseDetail,
        icon: Info,
      },
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
    ],
  },
  {
    title: t('sidebar.girvi'),
    icon: Gem,
    items: [
      {
        title: t('sidebar.allGirvi'),
        url: buildRoute.girvi.list(shopId),       // ✅ fixed
        icon: ClipboardList,
      },
      {
        title: t('sidebar.addGirvi'),
        url: buildRoute.girvi.add(shopId),        // ✅ fixed
        icon: UserPlus,
      },
      {
        title: t('sidebar.girviShopPayments'),
        url: buildRoute.girvi.shopPayments(shopId), // ✅ fixed
        icon: Wallet,
      },
    ],
  },
  {
    title: t('sidebar.girviTransfer'),
    icon: ArrowRightLeft,
    items: [
      {
        title: t('sidebar.allGirviTransfers'),
        url: ROUTES.girviTransferList,            // ⚠️ still has :shopId/:girviId — needs girviId too, leave as is
        icon: ClipboardList,
      },
      {
        title: t('sidebar.addGirviTransfer'),
      url: buildRoute.girviTransfer.add(shopId),             // ⚠️ same — needs girviId, leave as is
        icon: UserPlus,
      },
    ],
  },
  {
    title: t('sidebar.girviCashbook'),
    url: buildRoute.girviCashbook(shopId),        // ✅ fixed
    icon: BookOpen,
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
  {
  title: t('sidebar.bugReport'),
  url: ROUTES.bugReport,
  icon: Bug,
},
]