// FILE: src/hooks/girviTransfer/useGirviTransferList.ts

import { useGetTransfersByGirviQuery, useGetShopTransfersQuery } from '@/store/api/girviTransferApi'
import type { IGirviTransferFilters } from '@/types/girviTransfer.types'

// ── Transfers for a specific Girvi ──────────────────────────────────────────
export const useGirviTransferList = (
  shopId:   string,
  girviId:  string,
  filters?: Partial<IGirviTransferFilters>
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetTransfersByGirviQuery(
      {
        shopId,
        girviId,
        page:  filters?.page  ?? 1,
        limit: filters?.limit ?? 20,
        ...filters,
      },
      { skip: !shopId || !girviId }
    )

  return {
    transfers:  data?.data?.transfers ?? [],
    pagination: data?.meta?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

// ── All Transfers for a Shop ─────────────────────────────────────────────────
export const useShopTransferList = (
  shopId:   string,
  filters?: Partial<IGirviTransferFilters>
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetShopTransfersQuery(
      {
        shopId,
        page:  filters?.page  ?? 1,
        limit: filters?.limit ?? 20,
        ...filters,
      },
      { skip: !shopId }
    )

  return {
    transfers:  data?.data?.transfers ?? [],
    summary:    data?.data?.summary,
    pagination: data?.meta?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}