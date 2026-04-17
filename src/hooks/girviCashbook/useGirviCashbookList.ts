// FILE: src/hooks/girviCashbook/useGirviCashbookList.ts

import {
  useGetCashbookEntriesQuery,
  useGetGirviCashbookQuery,
} from '@/store/api/girviCashbookApi'
import type { IGirviCashbookFilters } from '@/types/girviCashbook.types'

export const useGirviCashbookList = (
  shopId:   string,
  filters?: Partial<IGirviCashbookFilters>
) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCashbookEntriesQuery(
    {
      shopId,
      page:  filters?.page  ?? 1,
      limit: filters?.limit ?? 50,
      sort:  filters?.sort  ?? '-entryDate',
      ...filters,
    },
    { skip: !shopId }
  )

  return {
    entries:       data?.data?.entries       ?? [],
    periodSummary: data?.data?.periodSummary,
    pagination:    data?.meta?.pagination,
    isLoading:     isLoading || isFetching,
    error,
    refetch,
  }
}

export const useGirviSpecificCashbook = (
  shopId:  string,
  girviId: string
) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetGirviCashbookQuery(
    { shopId, girviId },
    { skip: !shopId || !girviId }
  )

  return {
    girviNumber: data?.girviNumber,
    entries:     data?.entries     ?? [],
    summary:     data?.summary,
    isLoading:   isLoading || isFetching,
    error,
    refetch,
  }
}