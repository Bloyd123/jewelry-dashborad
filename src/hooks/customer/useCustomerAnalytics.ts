// FILE: src/features/customer/hooks/useCustomerAnalytics.ts
// Hook for customer analytics and statistics

import { useMemo } from 'react'
import { useGetCustomerAnalyticsQuery } from '@/store/api/customerApi'

/**
 * Hook for customer analytics
 * Fetches summary statistics and metrics
 */
export const useCustomerAnalytics = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerAnalyticsQuery({ shopId })

  // Memoized analytics data with defaults
  const analytics = useMemo(
    () =>
      data || {
        totalCustomers: 0,
        activeCustomers: 0,
        vipCustomers: 0,
        totalOutstanding: 0,
        totalLoyaltyPoints: 0,
        avgLifetimeValue: 0,
      },
    [data]
  )

  // Computed metrics
  const metrics = useMemo(() => {
    if (!data) return null

    return {
      ...analytics,
      activePercentage:
        analytics.totalCustomers > 0
          ? (analytics.activeCustomers / analytics.totalCustomers) * 100
          : 0,
      vipPercentage:
        analytics.totalCustomers > 0
          ? (analytics.vipCustomers / analytics.totalCustomers) * 100
          : 0,
    }
  }, [analytics, data])

  return {
    // Data
    analytics,
    metrics,

    // States
    isLoading: isLoading || isFetching,
    error,

    // Actions
    refetch,
  }
}
