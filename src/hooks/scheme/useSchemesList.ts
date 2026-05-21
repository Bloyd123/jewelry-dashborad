// FILE: src/hooks/scheme/useSchemesList.ts

import { useMemo } from 'react'
import {
  useGetSchemesQuery,
  useGetActiveSchemesQuery,
  useGetFeaturedSchemesQuery,
  useGetExpiringSoonQuery,
  useGetSchemesByTypeQuery,
} from '@/store/api/schemeApi'
import type { GetSchemesInput, SchemeType } from '@/types/scheme.types'

export const useSchemesList = (
  shopId: string,
  filters?: Partial<GetSchemesInput>
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetSchemesQuery({
    shopId,
    page:  filters?.page  || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

const schemes = useMemo(() => data?.data || [], [data]) 

const pagination = useMemo(() => {
  const p = data?.meta?.pagination
  if (!p) return undefined
  return {
    page:    p.currentPage  ?? p.page    ?? 1,
    pages:   p.totalPages   ?? p.pages   ?? 1,
    total:   p.totalItems   ?? p.total   ?? 0,
    limit:   p.pageSize     ?? p.limit   ?? 20,
    hasNext: p.hasNextPage  ?? p.hasNext ?? false,
    hasPrev: p.hasPrevPage  ?? p.hasPrev ?? false,
  }
}, [data])

  return {
    schemes,
    pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// ACTIVE SCHEMES
// ─────────────────────────────────────────────
export const useActiveSchemes = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetActiveSchemesQuery({ shopId }, { skip: !shopId })

  return {
    schemes:   data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// FEATURED SCHEMES
// ─────────────────────────────────────────────
export const useFeaturedSchemes = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetFeaturedSchemesQuery({ shopId }, { skip: !shopId })

  return {
    schemes:   data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// EXPIRING SOON
// ─────────────────────────────────────────────
export const useExpiringSoon = (shopId: string, days?: number) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetExpiringSoonQuery({ shopId, days }, { skip: !shopId })

  return {
    schemes:   data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// SCHEMES BY TYPE
// ─────────────────────────────────────────────
export const useSchemesByType = (shopId: string, schemeType: SchemeType) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemesByTypeQuery(
      { shopId, schemeType },
      { skip: !shopId || !schemeType }
    )

  return {
    schemes:   data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}