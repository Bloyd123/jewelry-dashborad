// FILE: src/features/customer/hooks/useCustomerActivity.ts

import { useGetCustomerActivityQuery } from '@/store/api/customerApi'

export const useCustomerActivity = (
  shopId: string,
  customerId: string,
  options?: { module?: string; action?: string; limit?: number }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerActivityQuery(
      { shopId, customerId, ...options },
      { skip: !shopId || !customerId }
    )

  return {
    logs:      data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}