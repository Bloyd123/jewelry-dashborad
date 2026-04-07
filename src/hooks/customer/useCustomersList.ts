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
 const pagination = useMemo(() => {
    const p = data?.meta?.pagination
    if (!p) return undefined
    return {
      page:    p.currentPage  ?? p.page    ?? 1,
      pages:   p.totalPages   ?? p.pages   ?? 1,
      total:   p.totalDocs    ?? p.total   ?? 0,
      limit:   p.limit        ?? 10,
      hasNext: p.hasNextPage  ?? p.hasNext ?? false,
      hasPrev: p.hasPrevPage  ?? p.hasPrev ?? false,
    }
  }, [data])

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
