// FILE: src/hooks/girviTransfer/useGirviTransferById.ts

import { useGetTransferByIdQuery } from '@/store/api/girviTransferApi'

export const useGirviTransferById = (
  shopId:     string,
  girviId:    string,
  transferId: string
) => {
  const { data: transfer, isLoading, isFetching, error, refetch } =
    useGetTransferByIdQuery(
      { shopId, girviId, transferId },
      { skip: !shopId || !girviId || !transferId }
    )

  return {
    transfer,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}