// FILE: src/hooks/scheme/useSchemeById.ts

import { useGetSchemeByIdQuery } from '@/store/api/schemeApi'

export const useSchemeById = (shopId: string, schemeId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemeByIdQuery(
      { shopId, schemeId },
      { skip: !shopId || !schemeId }
    )

  return {
    scheme:    data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}