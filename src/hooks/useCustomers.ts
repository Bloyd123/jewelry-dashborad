// ============================================================================
// FILE: src/hooks/customer/useCustomers.ts
// Combined Hook for Customer Management
// ============================================================================

import { useMemo } from 'react'
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '@/api/services/customerService'
import { useCustomerFilters } from './useCustomerFilters'
import { useCustomerPagination } from './useCustomerPagination'
import { useCustomerSelection } from './useCustomerSelection'
import type { ID } from '@/types'

export const useCustomers = (shopId: ID) => {
  const filters = useCustomerFilters()
  const pagination = useCustomerPagination()
  const selection = useCustomerSelection()

  // Build query parameters
  const queryParams = useMemo(
    () => ({
      shopId,
      page: pagination.currentPage,
      limit: pagination.pageSize,
      sort: `${pagination.sortOrder === 'desc' ? '-' : ''}${pagination.sortBy}`,
      ...filters.filters,
    }),
    [shopId, pagination, filters.filters]
  )

  // Fetch customers
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCustomersQuery(queryParams)

  // Mutations
  const [createCustomer, createState] = useCreateCustomerMutation()
  const [updateCustomer, updateState] = useUpdateCustomerMutation()
  const [deleteCustomer, deleteState] = useDeleteCustomerMutation()

  // Extract data
  const customers = data?.data?.data || []
  const meta = data?.data?.pagination

  return {
    // Data
    customers,
    meta,

    // Loading states
    isLoading,
    isFetching,
    isError,
    error,

    // Mutations
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // Mutation states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,

    // Filters
    filters: filters.filters,
    setFilters: filters.updateFilters,
    clearFilters: filters.reset,
    hasActiveFilters: filters.hasActiveFilters,

    // Pagination
    pagination,

    // Selection
    selection,

    // Utilities
    refetch,
  }
}
