// FILE: src/features/product/hooks/useProductById.ts

import { useGetProductByIdQuery } from '@/store/api/productApi'

/**
 *  SINGLE PRODUCT HOOK
 * For fetching a single product by ID
 *
 * Note: Assumes useGetProductByIdQuery exists in productApi
 * If not, you'll need to add it to the API slice
 */
export const useProductById = (shopId: string, productId: string) => {
  const {
    data: product,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductByIdQuery({ shopId, id: productId }, { skip: !productId })

  return {
    product,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
