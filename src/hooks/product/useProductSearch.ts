// FILE: src/features/product/hooks/useProductSearch.ts

import { useCallback } from 'react'
import { useLazySearchProductsQuery } from '@/store/api/productApi'

export const useProductSearch = (shopId: string) => {
  const [trigger, { data: results, isLoading, isFetching, reset }] =
    useLazySearchProductsQuery()

  const search = useCallback(
    (q: string, limit = 10) => {
      if (q.trim().length > 0) {
        trigger({ shopId, q, limit })
      }
    },
    [trigger, shopId]
  )

  const clearSearch = useCallback(() => {
    reset()
  }, [reset])

  return {
    search,
    clearSearch,
    results: results || [],
    isSearching: isLoading || isFetching,
  }
}