// FILE: src/features/product/hooks/useProductsList.ts

import { useGetProductsQuery } from '@/store/api/productApi'
import type { ProductFilters } from '@/types/product.types'

/**
 *  PRODUCTS LIST HOOK
 * Handles fetching and pagination of products list
 */
export const useProductsList = (
  shopId: string,
  filters?: Partial<ProductFilters>
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