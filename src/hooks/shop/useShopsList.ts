//
// FILE: src/features/shops/hooks/useShopsList.ts
//

import { useGetShopsQuery } from '@/store/api/ShopApi'
import type { ShopQueryParams } from '@/types/shop.types'

export const useShopsList = (filters?: Partial<ShopQueryParams>) => {
  const { data, isLoading, isFetching, error, refetch } = useGetShopsQuery({
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  return {
    shops: data?.data ?? [],
    pagination: data?.pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
