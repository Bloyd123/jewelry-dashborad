// FILE: src/features/customer/hooks/useCustomer.ts
// Custom hooks for customer operations

import { useCallback } from 'react'
import {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useLazySearchCustomerQuery,
} from '@/store/api/customerApi'

// 🔥 IMPORT FROM YOUR EXISTING TYPES FILE
import type {
  CustomerListParams,
  CreateCustomerRequest,
} from '@/types/customer.types'

export const useCustomer = (
  shopId: string,
  filters?: Partial<CustomerListParams>
) => {
  const {
    data: customersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCustomersQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  const [createCustomer, createState] = useCreateCustomerMutation()
  const [updateCustomer, updateState] = useUpdateCustomerMutation()
  const [deleteCustomer, deleteState] = useDeleteCustomerMutation()
  const [searchTrigger, searchResult] = useLazySearchCustomerQuery()

  const handleCreate = useCallback(
    async (data: CreateCustomerRequest) => {
      try {
        const result = await createCustomer({ shopId, ...data }).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Failed to create customer',
        }
      }
    },
    [createCustomer, shopId]
  )

  const handleSearch = useCallback(
    async (query: {
      phone?: string
      email?: string
      customerCode?: string
    }) => {
      try {
        const result = await searchTrigger({ shopId, ...query }).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        return { success: false, error: error.data?.message }
      }
    },
    [searchTrigger, shopId]
  )

  return {
    customers: customersData?.data?.customers || [],
    summary: customersData?.data?.summary,
    pagination: customersData?.meta?.pagination,

    isLoading: isLoading || isFetching,
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isSearching: searchResult.isFetching,

    createCustomer: handleCreate,
    updateCustomer,
    deleteCustomer,
    searchCustomer: handleSearch,
    refetch,

    createState,
    updateState,
    deleteState,
    searchResult,
  }
}

export const useCustomerById = (shopId: string, customerId: string) => {
  const { data, isLoading, error, refetch } = useGetCustomerByIdQuery({
    shopId,
    customerId,
  })

  return {
    customer: data,
    isLoading,
    error,
    refetch,
  }
}
