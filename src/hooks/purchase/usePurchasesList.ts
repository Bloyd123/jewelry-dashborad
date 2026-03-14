// FILE: src/features/purchase/hooks/usePurchaseList.ts
// Purchase Module - List & Query Hook

import {
  useGetPurchasesQuery,
  useGetPurchaseByIdQuery,
  useSearchPurchasesQuery,
  useLazySearchPurchasesQuery,
  useGetPurchasesBySupplierQuery,
  useGetPurchasesByDateRangeQuery,
  useGetPendingPurchasesQuery,
  useGetUnpaidPurchasesQuery,
} from '@/store/api/purchaseApi'
import type { IPurchaseFilters } from '@/types/purchase.types'
import { useCallback } from 'react'
import { useErrorHandler } from '@/hooks/useErrorHandler'

/**
 * 🎯 PURCHASE LIST HOOK
 * Fetch all purchases with filters & pagination
 */
export const usePurchaseList = (
  shopId: string,
  filters?: Partial<IPurchaseFilters>
) => {
  const {
    data: purchasesData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchasesQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    sort: filters?.sort || '-purchaseDate',
    ...filters,
  })

  return {
    // Data
    purchases: purchasesData?.data?.purchases || [],
    pagination: purchasesData?.meta?.pagination,

    // States
    isLoading: isLoading || isFetching,
    error,

    // Actions
    refetch,
  }
}

/**
 * 🎯 SINGLE PURCHASE HOOK
 * Get details of a specific purchase
 */
export const usePurchaseById = (shopId: string, purchaseId: string) => {
  const {
    data: purchase,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchaseByIdQuery(
    { shopId, purchaseId },
    { skip: !purchaseId } // Don't fetch if no ID
  )

  return {
    purchase,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

/**
 * 🎯 PURCHASE SEARCH HOOK
 * Search purchases with lazy loading
 */
export const usePurchaseSearch = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const [trigger, { data, isLoading, error }] = useLazySearchPurchasesQuery()

  const searchPurchases = useCallback(
    async (searchTerm: string, limit?: number) => {
      try {
        const result = await trigger({
          shopId,
          q: searchTerm,
          limit,
        }).unwrap()

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Search failed',
        }
      }
    },
    [trigger, shopId, handleError]
  )

  return {
    searchPurchases,
    searchResults: data || [],
    isSearching: isLoading,
    searchError: error,
  }
}

/**
 * 🎯 SUPPLIER PURCHASES HOOK
 * Get all purchases from a specific supplier
 */
export const useSupplierPurchases = (
  shopId: string,
  supplierId: string,
  filters?: Partial<IPurchaseFilters>
) => {
  const {
    data: purchasesData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchasesBySupplierQuery(
    {
      shopId,
      supplierId,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
      ...filters,
    },
    { skip: !supplierId }
  )

  return {
    purchases: purchasesData?.data?.purchases || [],
    pagination: purchasesData?.meta?.pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

/**
 * 🎯 DATE RANGE PURCHASES HOOK
 * Get purchases within a specific date range
 */
export const usePurchasesByDateRange = (
  shopId: string,
  startDate: string,
  endDate: string,
  filters?: { page?: number; limit?: number }
) => {
  const {
    data: purchasesData,
    isLoading,
    error,
    refetch,
  } = useGetPurchasesByDateRangeQuery(
    {
      shopId,
      startDate,
      endDate,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    },
    { skip: !startDate || !endDate }
  )

  return {
    purchases: purchasesData?.data?.purchases || [],
    pagination: purchasesData?.meta?.pagination,
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 PENDING PURCHASES HOOK
 * Get all pending/incomplete purchases
 */
export const usePendingPurchases = (shopId: string) => {
  const {
    data: purchases,
    isLoading,
    error,
    refetch,
  } = useGetPendingPurchasesQuery({ shopId })

  return {
    pendingPurchases: purchases || [],
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 UNPAID PURCHASES HOOK
 * Get all unpaid/partially paid purchases
 */
export const useUnpaidPurchases = (shopId: string) => {
  const {
    data: purchases,
    isLoading,
    error,
    refetch,
  } = useGetUnpaidPurchasesQuery({ shopId })

  return {
    unpaidPurchases: purchases || [],
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 EAGER SEARCH HOOK (auto-executes)
 * For autocomplete/instant search
 */
export const usePurchaseSearchEager = (
  shopId: string,
  searchQuery: string,
  limit: number = 10
) => {
  const {
    data: results,
    isLoading,
    error,
  } = useSearchPurchasesQuery(
    { shopId, q: searchQuery, limit },
    { skip: !searchQuery || searchQuery.length < 2 } // Skip if query too short
  )

  return {
    searchResults: results || [],
    isSearching: isLoading,
    searchError: error,
  }
}

export default usePurchaseList
