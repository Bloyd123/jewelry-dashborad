// FILE: src/features/product/hooks/useProductsList.ts

import { useGetProductsQuery } from '@/store/api/productApi'
import type { GetProductsInput } from '@/types/product.types'

export const useProductsList = (
  shopId: string,
  filters?: Partial<Omit<GetProductsInput, 'shopId'>>
) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductsQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  return {
    products: data?.data || [],
    pagination: data?.pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}