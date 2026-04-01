import { useGetSupplierActivityQuery } from '@/store/api/supplierApi'

export const useSupplierActivity = (
  shopId: string,
  supplierId: string,
  filters?: { page?: number; limit?: number; startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSupplierActivityQuery(
      { shopId, id: supplierId, ...filters },
      { skip: !supplierId }
    )

  return {
    logs: data?.logs || [],
    pagination: data?.pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}