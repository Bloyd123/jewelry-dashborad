// FILE: src/hooks/girviCashbook/useGirviCashbookById.ts

import { useGetCashbookEntryByIdQuery } from '@/store/api/girviCashbookApi'

export const useGirviCashbookById = (
  shopId:  string,
  entryId: string
) => {
  const {
    data:      entry,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCashbookEntryByIdQuery(
    { shopId, entryId },
    { skip: !shopId || !entryId }
  )

  return {
    entry,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}