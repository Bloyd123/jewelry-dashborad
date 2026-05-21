// FILE: src/hooks/scheme/useSchemeSearch.ts

import { useCallback } from 'react'
import { useLazyLazySearchSchemesQuery } from '@/store/api/schemeApi'
import type { Scheme } from '@/types/scheme.types'

interface SearchResult {
  success: boolean
  schemes: Scheme[]
  error?:  string
}

export const useSchemeSearch = (shopId: string) => {
  const [triggerSearch, { data, isLoading, isFetching, error }] =
    useLazyLazySearchSchemesQuery()

  const searchScheme = useCallback(
    async (q: string): Promise<SearchResult> => {  // ✅ explicit return type
      try {
        const result = await triggerSearch({ shopId, q }).unwrap()
        return { success: true, schemes: result }
      } catch (err: any) {
        return {
          success: false,
          error:   err.data?.message || 'Search failed',
          schemes: [],
        }
      }
    },
    [shopId, triggerSearch]
  )

  return {
    schemes:     data || [],
    isSearching: isLoading || isFetching,
    error,
    searchScheme,
  }
}