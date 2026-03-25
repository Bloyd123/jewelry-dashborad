// FILE: src/features/product/hooks/useProductAnalytics.ts

import {
  useGetProductAnalyticsQuery,
  useGetLowStockProductsQuery,
  useGetProductHistoryQuery,
} from '@/store/api/productApi'

// ── ANALYTICS ─────────────────────────────────────────────────────
export const useProductAnalytics = (shopId: string) => {
  const { data, isLoading, isFetching, refetch } = useGetProductAnalyticsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    analytics:         data,
    overview:          data?.overview,
    categoryBreakdown: data?.categoryBreakdown || [],
    isLoading:         isLoading || isFetching,
    refetch,
  }
}

// ── LOW STOCK ──────────────────────────────────────────────────────
export const useLowStock = (shopId: string, threshold?: number) => {
  const { data, isLoading, isFetching, refetch } = useGetLowStockProductsQuery(
    { shopId, threshold },
    { skip: !shopId }
  )

  return {
    lowStockProducts: data?.data || [],
    totalLowStock:    data?.totalLowStockItems || 0,
    criticalItems:    data?.criticalItems || 0,
    isLoading:        isLoading || isFetching,
    refetch,
  }
}

// ── PRODUCT HISTORY ────────────────────────────────────────────────
export const useProductHistory = (
  shopId: string,
  productId: string,
  limit?: number
) => {
  const { data, isLoading, isFetching, refetch } = useGetProductHistoryQuery(
    { shopId, id: productId, limit },
    { skip: !productId || !shopId }
  )

  return {
    product:   data?.product,
    history:   data?.history || [],
    isLoading: isLoading || isFetching,
    refetch,
  }
}