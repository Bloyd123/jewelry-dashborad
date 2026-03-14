//
// FILE: src/features/shops/hooks/useShopStats.ts
//

import { useGetShopStatisticsQuery } from '@/store/api/ShopApi'

export const useShopStats = (shopId: string) => {
  const {
    data: statistics,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetShopStatisticsQuery(shopId, { skip: !shopId })

  return {
    statistics,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}
