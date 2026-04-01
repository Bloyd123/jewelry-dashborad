import { useGetShopStatisticsQuery } from '@/store/api/ShopApi'
import { useSaleAnalytics } from '@/hooks/sales/useSaleAnalytics'
import { usePaymentAnalytics } from '@/hooks/payment/usePaymentAnalytics'
import { useSalesList } from '@/hooks/sales/useSalesList'
import {
  useGetTopProductsQuery,
  useGetSalesByCategoryQuery,
  useGetMonthlyComparisonQuery,
  useGetRevenueVsExpensesQuery,
} from '@/store/api/salesApi'
import type { ShopStatistics } from '@/types/shop.types'
import type { StatisticsData }  from '@/components/shop/ShopDetailsPage/tabs/StatisticsTab'
const transformToStatisticsData = (
  raw: ShopStatistics,
  salesAnalytics: any,
  paymentModeBreakdown: any[],
  totalReceipts: any,
  recentSales: any[],
  topProducts: any[],
  salesByCategory: any[],
  monthlyComparison: any[],
  revenueVsExpenses: any[],
): StatisticsData => {

  // ── Sales Trend ──
  const salesTrend = salesAnalytics?.analytics?.length
    ? {
        labels: salesAnalytics.analytics.map((item: any) => item._id?.date || ''),
        data:   salesAnalytics.analytics.map((item: any) => item.totalAmount || 0),
      }
    : undefined

  // ── Sales by Payment Method ──
  const salesByPaymentMethod = paymentModeBreakdown?.length
    ? paymentModeBreakdown.map((item: any) => ({
        name:  item._id || 'Other',
        value: item.totalAmount || 0,
      }))
    : undefined

  // ── Recent Transactions ──
  const recentTransactions = recentSales.map((sale: any) => ({
    _id:           sale._id,
    orderNumber:   sale.invoiceNumber   || '',
    customerName:  sale.customerDetails?.customerName || 'Unknown',
    date:          sale.saleDate        || '',
    amount:        sale.financials?.grandTotal || 0,
    status:        (
      sale.status === 'completed' || sale.status === 'cancelled'
        ? sale.status
        : 'pending'
    ) as 'completed' | 'pending' | 'cancelled',
    paymentMethod: sale.payment?.paymentMode || 'cash',
  }))

  // ── Top Products ──
  const formattedTopProducts = topProducts.map((item: any, index: number) => ({
    _id:            String(index),
    productCode:    item.productCode   || '',
    productName:    item.productName   || '',
    category:       item.metalType     || '',
    totalSold:      item.totalQuantity || 0,
    revenue:        item.totalRevenue  || 0,
    stockRemaining: 0,
  }))

  return {
    // ── Basic Stats ──
    totalSales: {
      amount: raw.totalSalesAmount || 0,
      growth: '+0%',
    },
    totalOrders: {
      count: raw.totalOrders || 0,
      growth: '+0%',
    },
    revenue: {
      amount: totalReceipts?.amount || raw.averageOrderValue || 0,
      growth: '+0%',
    },
    customers: {
      count: raw.totalCustomers || 0,
      growth: '+0%',
    },

    // ── Inventory ──
    inventoryOverview: {
      totalProducts: raw.totalProducts     || 0,
      stockValue:    raw.totalInventoryValue || 0,
      lowStock:      raw.lowStockItems     || 0,
    },

    // ── Charts ──
    salesTrend,
    salesByPaymentMethod,
    recentTransactions,
    topProducts:       formattedTopProducts.length ? formattedTopProducts : undefined,
    salesByCategory:   salesByCategory.length      ? salesByCategory      : undefined,
    monthlyComparison: monthlyComparison.length     ? monthlyComparison    : undefined,
    revenueTrend:      revenueVsExpenses.length     ? revenueVsExpenses    : undefined,
  }
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export const useShopStats = (shopId: string) => {
  // 1. Basic shop statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
    refetch,
  } = useGetShopStatisticsQuery(shopId, { skip: !shopId })

  // 2. Sales analytics
  const {
    analytics: salesAnalytics,
    isAnalyticsLoading,
  } = useSaleAnalytics(shopId, { groupBy: 'month' })

  // 3. Payment analytics
  const {
    paymentModeBreakdown,
    totalReceipts,
    isLoading: isLoadingPayments,
  } = usePaymentAnalytics(shopId, { groupBy: 'month' })

  // 4. Recent sales
  const {
    sales: recentSales,
    isLoading: isLoadingRecent,
  } = useSalesList(shopId, { limit: 10, sort: '-saleDate' })

  // 5. Top products
  const {
    data: topProducts,
    isLoading: isLoadingTopProducts,
  } = useGetTopProductsQuery(
    { shopId, limit: 5 },
    { skip: !shopId }
  )

  // 6. Sales by category
  const {
    data: salesByCategory,
    isLoading: isLoadingCategory,
  } = useGetSalesByCategoryQuery(
    { shopId },
    { skip: !shopId }
  )

  // 7. Monthly comparison
  const {
    data: monthlyComparison,
    isLoading: isLoadingMonthly,
  } = useGetMonthlyComparisonQuery(
    { shopId },
    { skip: !shopId }
  )

  // 8. Revenue vs Expenses
  const {
    data: revenueVsExpenses,
    isLoading: isLoadingRevenue,
  } = useGetRevenueVsExpensesQuery(
    { shopId },
    { skip: !shopId }
  )

  const isLoading =
    isLoadingStats       ||
    isFetchingStats      ||
    isAnalyticsLoading   ||
    isLoadingPayments    ||
    isLoadingRecent      ||
    isLoadingTopProducts ||
    isLoadingCategory    ||
    isLoadingMonthly     ||
    isLoadingRevenue

  const statistics = statsData?.data
    ? transformToStatisticsData(
        statsData.data,
        salesAnalytics,
        paymentModeBreakdown,
        totalReceipts,
        recentSales,
        topProducts        || [],
        salesByCategory    || [],
        monthlyComparison  || [],
        revenueVsExpenses  || [],
      )
    : null

  return {
    statistics,
    isLoading,
    refetch,
  }
}