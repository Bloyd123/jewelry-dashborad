// FILE: src/features/supplier/hooks/useSuppliersList.ts

import { useGetSuppliersQuery } from '@/store/api/supplierApi'
import type { SupplierFilters } from '@/types/supplier.types'
export const useSuppliersList = (
  shopId: string,
  filters?: Partial<SupplierFilters>
) => {
const { data, isLoading, isFetching, error, refetch } = useGetSuppliersQuery(
  {
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
    search: filters?.search || undefined, // ← empty string nahi bhejta
  },
  { skip: !shopId }
)

  return {
    suppliers: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
