// FILE: src/features/shops/hooks/useShopById.ts

import { useGetShopByIdQuery } from '@/store/api/ShopApi'
import type { Shop } from '@/types/shop.types'

interface UseShopByIdOptions {
  includeSettings?: boolean
  skip?: boolean
}

export const useShopById = (shopId: string, options?: UseShopByIdOptions) => {
  const { data, isLoading, isFetching, error, refetch } = useGetShopByIdQuery(
    { id: shopId, includeSettings: options?.includeSettings },
    { skip: !shopId || options?.skip }
  )

  return {
    shop: data?.data || null,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}