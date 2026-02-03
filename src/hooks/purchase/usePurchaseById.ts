// FILE: src/hooks/purchase/usePurchaseById.ts
// Hook for fetching single purchase details by ID

import { useGetPurchasesQuery } from '@/store/api/purchaseApi'

/**
 * Custom hook for fetching a single purchase by ID
 * Note: This uses the same query as the list but filters by ID
 * If you have a separate API endpoint for single purchase, replace this
 */
export const usePurchaseById = (shopId: string, purchaseId: string) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchasesQuery({
    shopId,
    page: 1,
    limit: 1,
  })

  // Find the specific purchase from the list
  const purchase = data?.data?.purchases?.find((p) => p.id === purchaseId)

  return {
    // Data
    purchase: purchase || null,

    // Loading states
    isLoading: isLoading || isFetching,

    // Actions
    refetch,

    // Error
    error,
  }
}

export default usePurchaseById