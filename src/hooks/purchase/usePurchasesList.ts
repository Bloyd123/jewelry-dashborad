// FILE: src/hooks/purchase/usePurchasesList.ts
// Hook for fetching and listing purchases with pagination

import { useGetPurchasesQuery } from '@/store/api/purchaseApi'
import type { IPurchaseFilters } from '@/types/purchase.types'

/**
 * Custom hook for fetching purchases list with pagination
 * Handles data fetching, caching, and pagination logic
 */
export const usePurchasesList = (
  shopId: string,
  filters?: Partial<IPurchaseFilters>
) => {
  // ============================================
  // 📊 FETCH PURCHASES (with auto-caching)
  // ============================================
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchasesQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  // ============================================
  // 📤 RETURN API
  // ============================================
  return {
    // Data
    purchases: data?.data?.purchases || [],
    pagination: {
      page: data?.data?.page || 1,
      limit: data?.data?.limit || 20,
      total: data?.data?.total || 0,
      pages: Math.ceil((data?.data?.total || 0) / (data?.data?.limit || 20)),
      hasNext:
        (data?.data?.page || 1) <
        Math.ceil((data?.data?.total || 0) / (data?.data?.limit || 20)),
      hasPrev: (data?.data?.page || 1) > 1,
    },

    // Loading states
    isLoading: isLoading || isFetching,

    // Actions
    refetch,

    // Error
    error,
  }
}

export default usePurchasesList