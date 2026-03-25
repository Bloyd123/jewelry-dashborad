// FILE: src/hooks/purchase/usePurchaseAnalytics.ts

import {
  useGetPurchaseAnalyticsQuery,
  useGetPendingPurchasesQuery,
  useGetUnpaidPurchasesQuery,
} from '@/store/api/purchaseApi'

export const usePurchaseAnalytics = (
  shopId: string,
  filters?: { startDate?: string; endDate?: string }
) => {
  const { data: analytics, isLoading } = useGetPurchaseAnalyticsQuery({
    shopId,
    ...filters,
  })

  return {
    analytics,
    isLoading,
  }
}

export const usePendingPurchases = (
  shopId: string,
  page = 1,
  limit = 20
) => {
  const { data, isLoading } = useGetPendingPurchasesQuery({ shopId, page, limit })

  return {
    purchases:  data?.data?.purchases ?? [],
    pagination: data?.data,
    isLoading,
  }
}

export const useUnpaidPurchases = (
  shopId: string,
  page = 1,
  limit = 20
) => {
  const { data, isLoading } = useGetUnpaidPurchasesQuery({ shopId, page, limit })

  return {
    purchases:  data?.data?.purchases ?? [],
    pagination: data?.data,
    isLoading,
  }
}