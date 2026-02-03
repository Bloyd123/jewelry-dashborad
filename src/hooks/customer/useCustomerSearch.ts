// FILE: src/features/customer/hooks/useCustomerSearch.ts
// Hook for customer search functionality

import { useCallback } from 'react'
import { useLazySearchCustomerQuery } from '@/store/api/customerApi'
import type { SearchCustomerInput } from '@/types/customer.types'

/**
 * Hook for customer search
 * Provides manual search trigger for lazy loading
 */
export const useCustomerSearch = (shopId: string) => {
  const [triggerSearch, { data, isLoading, isFetching, error }] =
    useLazySearchCustomerQuery()

  // Search function with shopId pre-filled
  const searchCustomer = useCallback(
    async (params: Omit<SearchCustomerInput, 'shopId'>) => {
      try {
        const result = await triggerSearch({ shopId, ...params }).unwrap()
        return { success: true, customer: result }
      } catch (err: any) {
        return {
          success: false,
          error: err.data?.message || 'Search failed',
          customer: null,
        }
      }
    },
    [shopId, triggerSearch]
  )

  return {
    // Data
    customer: data,

    // States
    isSearching: isLoading || isFetching,
    error,

    // Actions
    searchCustomer,
  }
}
