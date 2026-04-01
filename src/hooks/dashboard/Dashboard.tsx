// FILE: src/features/dashboard/hooks/useDashboard.ts

import { useGetSalesAnalyticsQuery, useGetSalesQuery, useGetTopProductsQuery } from '@/store/api/salesApi'
import { useGetCustomerAnalyticsQuery } from '@/store/api/customerApi'
import { useGetProductAnalyticsQuery, useGetLowStockProductsQuery } from '@/store/api/productApi'

interface UseDashboardOptions {
  startDate?: string
  endDate?:   string
  groupBy?:   'day' | 'week' | 'month' | 'year'
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export const useDashboard = (shopId: string, options?: UseDashboardOptions) => {

  // ── 1. Sales Analytics — Revenue + Orders + Chart ──────────
  const {
    data:      salesAnalytics,
    isLoading: isSalesAnalyticsLoading,
    refetch:   refetchSalesAnalytics,
  } = useGetSalesAnalyticsQuery({
    shopId,
    startDate: options?.startDate,
    endDate:   options?.endDate,
    groupBy:   options?.groupBy || 'day',
  }, { skip: !shopId })

  // ── 2. Customer Analytics — Total Customers ────────────────
  const {
    data:      customerAnalytics,
    isLoading: isCustomerAnalyticsLoading,
    refetch:   refetchCustomerAnalytics,
  } = useGetCustomerAnalyticsQuery(
    { shopId },
    { skip: !shopId }
  )

  // ── 3. Product Analytics — Total Products ──────────────────
  const {
    data:      productAnalytics,
    isLoading: isProductAnalyticsLoading,
    refetch:   refetchProductAnalytics,
  } = useGetProductAnalyticsQuery(
    { shopId },
    { skip: !shopId }
  )

  // ── 4. Recent Orders — Latest 5 Sales ─────────────────────
  const {
    data:      recentOrdersData,
    isLoading: isRecentOrdersLoading,
    refetch:   refetchRecentOrders,
  } = useGetSalesQuery({
    shopId,
    limit: 5,
    sort:  '-saleDate',
  }, { skip: !shopId })

  // ── 5. Low Stock Alerts ────────────────────────────────────
  const {
    data:      lowStockData,
    isLoading: isLowStockLoading,
    refetch:   refetchLowStock,
  } = useGetLowStockProductsQuery(
    { shopId },
    { skip: !shopId }
  )

  // ── 6. Top Products ────────────────────────────────────────
  const {
    data:      topProductsData,
    isLoading: isTopProductsLoading,
    refetch:   refetchTopProducts,
  } = useGetTopProductsQuery({
    shopId,
    limit:     5,
    startDate: options?.startDate,
    endDate:   options?.endDate,
  }, { skip: !shopId })

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────
  return {

    // ── Stats Cards ───────────────────────────
    stats: {
      totalRevenue:  salesAnalytics?.totalAmount       || 0,
      totalOrders:   salesAnalytics?.totalSales        || 0,
      totalProducts: productAnalytics?.overview?.totalProducts || 0,
      totalCustomers: customerAnalytics?.totalCustomers || 0,
    },

    // ── Sales Chart ───────────────────────────
    salesAnalytics: salesAnalytics || null,

    // ── Recent Orders ─────────────────────────
    recentOrders: recentOrdersData?.data?.sales || [],

    // ── Stock Alerts ──────────────────────────
    lowStockProducts: lowStockData?.data         || [],
    totalLowStock:    lowStockData?.totalLowStockItems || 0,
    criticalItems:    lowStockData?.criticalItems || 0,

    // ── Top Products ──────────────────────────
    topProducts: topProductsData || [],

    // ── Loading States ────────────────────────
    isLoading:
      isSalesAnalyticsLoading    ||
      isCustomerAnalyticsLoading ||
      isProductAnalyticsLoading  ||
      isRecentOrdersLoading      ||
      isLowStockLoading          ||
      isTopProductsLoading,

    isSalesAnalyticsLoading,
    isCustomerAnalyticsLoading,
    isProductAnalyticsLoading,
    isRecentOrdersLoading,
    isLowStockLoading,
    isTopProductsLoading,

    // ── Refetch All ───────────────────────────
    refetchAll: () => {
      refetchSalesAnalytics()
      refetchCustomerAnalytics()
      refetchProductAnalytics()
      refetchRecentOrders()
      refetchLowStock()
      refetchTopProducts()
    },
  }
}