// FILE: src/features/customer/hooks/useCustomerLoyaltySummary.ts

import { useGetCustomerLoyaltySummaryQuery } from '@/store/api/customerApi'

export const useCustomerLoyaltySummary = (shopId: string, customerId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerLoyaltySummaryQuery(
      { shopId, customerId },
      { skip: !shopId || !customerId }
    )

  return {
    totalEarned:    data?.totalEarned    || 0,
    totalRedeemed:  data?.totalRedeemed  || 0,
    recentActivity: data?.recentActivity || [],
    isLoading:      isLoading || isFetching,
    error,
    refetch,
  }
}