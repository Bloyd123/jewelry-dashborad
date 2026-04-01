// FILE: src/features/customer/hooks/useCustomerDocuments.ts

import { useGetCustomerDocumentsQuery } from '@/store/api/customerApi'

export const useCustomerDocuments = (shopId: string, customerId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerDocumentsQuery(
      { shopId, customerId },
      { skip: !shopId || !customerId }
    )

  return {
    documents: data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}