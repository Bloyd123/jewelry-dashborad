// FILE: src/hooks/purchase/usePurchaseAnalytics.ts
// Hook for purchase analytics and computed statistics

import { useMemo } from 'react'
import { useGetPurchasesQuery } from '@/store/api/purchaseApi'
import type { IPurchaseFilters } from '@/types/purchase.types'

/**
 * Custom hook for purchase analytics and statistics
 * Provides computed data, summaries, and insights from purchase data
 */
export const usePurchaseAnalytics = (
  shopId: string,
  filters?: Partial<IPurchaseFilters>
) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetPurchasesQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  const purchases = data?.data?.purchases || []

 
  // 📊 COMPUTED ANALYTICS
 
  const analytics = useMemo(() => {
    if (!purchases.length) {
      return {
        totalPurchases: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalPending: 0,
        averagePurchaseAmount: 0,
        statusBreakdown: {},
        recentPurchases: [],
      }
    }

    const totalAmount = purchases.reduce(
      (sum, purchase) => sum + (purchase.totalAmount || 0),
      0
    )

    const totalPaid = purchases.reduce(
      (sum, purchase) => sum + (purchase.paidAmount || 0),
      0
    )

    const totalPending = totalAmount - totalPaid

    const statusBreakdown = purchases.reduce(
      (acc, purchase) => {
        const status = purchase.status || 'unknown'
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const averagePurchaseAmount = purchases.length > 0 
      ? totalAmount / purchases.length 
      : 0

    // Get 5 most recent purchases
    const recentPurchases = [...purchases]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 5)

    return {
      totalPurchases: purchases.length,
      totalAmount,
      totalPaid,
      totalPending,
      averagePurchaseAmount,
      statusBreakdown,
      recentPurchases,
    }
  }, [purchases])

 
  // 📤 RETURN API
 
  return {
    // Analytics data
    analytics,

    // Raw data
    purchases,

    // Loading states
    isLoading: isLoading || isFetching,

    // Error
    error,
  }
}

export default usePurchaseAnalytics