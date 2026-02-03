// FILE: src/features/customer/hooks/useCustomersList.ts
// Hook for fetching and filtering customer lists

import { useMemo } from 'react'
import { useGetCustomersQuery } from '@/store/api/customerApi'
import type { CustomerListParams } from '@/types/customer.types'

/**
 * Hook for customer list operations
 * Handles fetching, filtering, and pagination
 */
export const useCustomersList = (
  shopId: string,
  filters?: Partial<CustomerListParams>
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetCustomersQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  // Memoized computed values
  const customers = useMemo(() => data?.data?.customers || [], [data])
  const summary = useMemo(() => data?.data?.summary, [data])
  const pagination = useMemo(() => data?.meta?.pagination, [data])

  return {
    // Data
    customers,
    summary,
    pagination,

    // States
    isLoading: isLoading || isFetching,
    error,

    // Actions
    refetch,
  }
}
