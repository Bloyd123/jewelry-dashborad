//
// FILE: src/features/shops/hooks/useShopById.ts
//

import { useGetShopByIdQuery } from '@/store/api/ShopApi'

export const useShopById = (shopId: string) => {
  const {
    data: shop,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetShopByIdQuery(shopId, { skip: !shopId })

  return {
    shop,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
