// FILE: src/features/shops/hooks/useShopStats.ts

import { useGetShopStatisticsQuery } from '@/store/api/ShopApi'

export const useShopStats = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } = useGetShopStatisticsQuery(shopId, {
    skip: !shopId,
  })

  return {
    statistics: data?.data || null,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}