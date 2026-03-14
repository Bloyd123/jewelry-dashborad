// FILE: src/features/purchase/hooks/usePurchaseAnalytics.ts
// Purchase Module - Analytics & Reports Hook

import { useGetPurchaseAnalyticsQuery } from '@/store/api/purchaseApi'
import { useMemo } from 'react'
import type { IPurchaseAnalytics } from '@/types/purchase.types'

/**
 * PURCHASE ANALYTICS HOOK
 * Get comprehensive analytics and statistics
 */
export const usePurchaseAnalytics = (
  shopId: string,
  filters?: { startDate?: string; endDate?: string }
) => {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useGetPurchaseAnalyticsQuery({
    shopId,
    ...filters,
  })

  // Computed metrics
  const computedMetrics = useMemo(() => {
    if (!analytics) return null

    // Average purchase value
    const avgPurchaseValue =
      analytics.totalPurchases > 0
        ? analytics.totalPurchaseValue / analytics.totalPurchases
        : 0

    // Payment completion rate
    const paidCount =
      analytics.paymentStatusBreakdown.find(item => item._id === 'paid')
        ?.count || 0
    const paymentCompletionRate =
      analytics.totalPurchases > 0
        ? (paidCount / analytics.totalPurchases) * 100
        : 0

    // Pending percentage
    const pendingPercentage =
      analytics.totalPurchases > 0
        ? (analytics.pendingPurchases / analytics.totalPurchases) * 100
        : 0

    // Monthly average
    const monthlyAverage =
      analytics.monthlyTrend.length > 0
        ? analytics.monthlyTrend.reduce(
            (sum, month) => sum + month.totalValue,
            0
          ) / analytics.monthlyTrend.length
        : 0

    // Growth rate (comparing latest month to previous)
    let growthRate = 0
    if (analytics.monthlyTrend.length >= 2) {
      const latest = analytics.monthlyTrend[0].totalValue
      const previous = analytics.monthlyTrend[1].totalValue
      growthRate = previous > 0 ? ((latest - previous) / previous) * 100 : 0
    }

    return {
      avgPurchaseValue,
      paymentCompletionRate,
      pendingPercentage,
      monthlyAverage,
      growthRate,
    }
  }, [analytics])

  return {
    // Raw analytics
    analytics,

    // Computed metrics
    metrics: computedMetrics,

    // States
    isLoading,
    error,

    // Actions
    refetch,
  }
}

/**
 * 🎯 PURCHASE SUMMARY HOOK
 * Quick summary stats for dashboard
 */
export const usePurchaseSummary = (shopId: string) => {
  const { analytics, isLoading, error } = usePurchaseAnalytics(shopId)

  const summary = useMemo(() => {
    if (!analytics) return null

    return {
      totalPurchases: analytics.totalPurchases,
      totalValue: analytics.totalPurchaseValue,
      pendingCount: analytics.pendingPurchases,
      topSupplier: analytics.topSuppliers[0]?.supplier?.businessName || 'N/A',
    }
  }, [analytics])

  return {
    summary,
    isLoading,
    error,
  }
}

/**
 * 🎯 PAYMENT STATUS BREAKDOWN HOOK
 * Detailed payment status analytics
 */
export const usePaymentStatusBreakdown = (shopId: string) => {
  const { analytics, isLoading, error } = usePurchaseAnalytics(shopId)

  const breakdown = useMemo(() => {
    if (!analytics) return null

    const total = analytics.totalPurchases

    return analytics.paymentStatusBreakdown.map(item => ({
      status: item._id,
      count: item.count,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }))
  }, [analytics])

  return {
    breakdown,
    isLoading,
    error,
  }
}

/**
 * 🎯 TOP SUPPLIERS HOOK
 * Get top suppliers by purchase value
 */
export const useTopSuppliers = (shopId: string, limit: number = 5) => {
  const { analytics, isLoading, error } = usePurchaseAnalytics(shopId)

  const topSuppliers = useMemo(() => {
    if (!analytics) return []

    return analytics.topSuppliers.slice(0, limit).map(item => ({
      id: item._id,
      name: item.supplier?.businessName || 'Unknown',
      code: item.supplier?.supplierCode || '',
      totalPurchases: item.totalPurchases,
      totalValue: item.totalValue,
      avgPurchaseValue: item.totalValue / item.totalPurchases,
    }))
  }, [analytics, limit])

  return {
    topSuppliers,
    isLoading,
    error,
  }
}

/**
 * 🎯 MONTHLY TREND HOOK
 * Get monthly purchase trend data
 */
export const useMonthlyTrend = (
  shopId: string,
  filters?: { startDate?: string; endDate?: string }
) => {
  const { analytics, isLoading, error } = usePurchaseAnalytics(shopId, filters)

  const trendData = useMemo(() => {
    if (!analytics) return []

    return analytics.monthlyTrend.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      year: item._id.year,
      monthNumber: item._id.month,
      count: item.count,
      totalValue: item.totalValue,
      avgValue: item.count > 0 ? item.totalValue / item.count : 0,
    }))
  }, [analytics])

  return {
    trendData,
    isLoading,
    error,
  }
}

/**
 * 🎯 PURCHASE COMPARISON HOOK
 * Compare current period with previous period
 */
export const usePurchaseComparison = (
  shopId: string,
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string
) => {
  // Current period
  const { data: currentAnalytics, isLoading: isLoadingCurrent } =
    useGetPurchaseAnalyticsQuery({
      shopId,
      startDate: currentStart,
      endDate: currentEnd,
    })

  // Previous period
  const { data: previousAnalytics, isLoading: isLoadingPrevious } =
    useGetPurchaseAnalyticsQuery({
      shopId,
      startDate: previousStart,
      endDate: previousEnd,
    })

  const comparison = useMemo(() => {
    if (!currentAnalytics || !previousAnalytics) return null

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    return {
      purchaseCount: {
        current: currentAnalytics.totalPurchases,
        previous: previousAnalytics.totalPurchases,
        change: calculateChange(
          currentAnalytics.totalPurchases,
          previousAnalytics.totalPurchases
        ),
      },
      purchaseValue: {
        current: currentAnalytics.totalPurchaseValue,
        previous: previousAnalytics.totalPurchaseValue,
        change: calculateChange(
          currentAnalytics.totalPurchaseValue,
          previousAnalytics.totalPurchaseValue
        ),
      },
      pendingCount: {
        current: currentAnalytics.pendingPurchases,
        previous: previousAnalytics.pendingPurchases,
        change: calculateChange(
          currentAnalytics.pendingPurchases,
          previousAnalytics.pendingPurchases
        ),
      },
    }
  }, [currentAnalytics, previousAnalytics])

  return {
    comparison,
    isLoading: isLoadingCurrent || isLoadingPrevious,
    currentPeriod: currentAnalytics,
    previousPeriod: previousAnalytics,
  }
}

/**
 * 🎯 YEAR-OVER-YEAR ANALYTICS HOOK
 * Compare same period across different years
 */
export const useYearOverYearAnalytics = (
  shopId: string,
  currentYear: number,
  previousYear: number
) => {
  const currentStart = `${currentYear}-01-01`
  const currentEnd = `${currentYear}-12-31`
  const previousStart = `${previousYear}-01-01`
  const previousEnd = `${previousYear}-12-31`

  return usePurchaseComparison(
    shopId,
    currentStart,
    currentEnd,
    previousStart,
    previousEnd
  )
}

/**
 * 🎯 PURCHASE PERFORMANCE METRICS HOOK
 * Key performance indicators
 */
export const usePurchasePerformanceMetrics = (shopId: string) => {
  const { analytics, metrics, isLoading, error } = usePurchaseAnalytics(shopId)

  const kpis = useMemo(() => {
    if (!analytics || !metrics) return null

    // Average items per purchase
    const totalItems = analytics.topSuppliers.reduce(
      (sum, supplier) => sum + supplier.totalPurchases,
      0
    )
    const avgItemsPerPurchase =
      analytics.totalPurchases > 0 ? totalItems / analytics.totalPurchases : 0

    // Supplier concentration (% from top supplier)
    const topSupplierValue = analytics.topSuppliers[0]?.totalValue || 0
    const supplierConcentration =
      analytics.totalPurchaseValue > 0
        ? (topSupplierValue / analytics.totalPurchaseValue) * 100
        : 0

    return {
      avgPurchaseValue: metrics.avgPurchaseValue,
      paymentCompletionRate: metrics.paymentCompletionRate,
      pendingPercentage: metrics.pendingPercentage,
      growthRate: metrics.growthRate,
      avgItemsPerPurchase,
      supplierConcentration,
      monthlyAverage: metrics.monthlyAverage,
    }
  }, [analytics, metrics])

  return {
    kpis,
    isLoading,
    error,
  }
}

export default usePurchaseAnalytics
