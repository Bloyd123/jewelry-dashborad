// FILE: src/features/supplier/hooks/useSupplierById.ts

import { useGetSupplierByIdQuery } from '@/store/api/supplierApi'

/**
 *  SINGLE SUPPLIER HOOK
 * For fetching a single supplier by ID
 */
export const useSupplierById = (shopId: string, supplierId: string) => {
  const {
    data: supplier,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSupplierByIdQuery({ shopId, id: supplierId }, { skip: !supplierId })

  return {
    supplier,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
