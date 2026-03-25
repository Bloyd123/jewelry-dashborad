// FILE: src/hooks/purchase/usePurchaseById.ts

import { useGetPurchaseByIdQuery } from '@/store/api/purchaseApi'

export const usePurchaseById = (shopId: string, purchaseId: string) => {
  const {
    data: purchase,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchaseByIdQuery(
    { shopId, purchaseId },
    { skip: !shopId || !purchaseId }
  )

  return {
    purchase,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}