// FILE: src/features/customer/hooks/useCustomerById.ts
// Hook for fetching a single customer

import { useMemo } from 'react'
import { useGetCustomerByIdQuery } from '@/store/api/customerApi'

/**
 * Hook for fetching single customer details
 */
export const useCustomerById = (shopId: string, customerId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerByIdQuery(
      { shopId, customerId },
      {
        skip: !shopId || !customerId, // Skip if IDs are not provided
      }
    )

  // Memoized customer data
  const customer = useMemo(() => data || null, [data])

  return {
    // Data
    customer,

    // States
    isLoading: isLoading || isFetching,
    error,

    // Actions
    refetch,
  }
}
