// FILE: src/features/product/hooks/useProductById.ts

import { useGetProductByIdQuery } from '@/store/api/productApi'

export const useProductById = (shopId: string, productId: string) => {
  const {
    data: product,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductByIdQuery(
    { shopId, id: productId },
    { skip: !productId || !shopId }
  )

  return {
    product,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}