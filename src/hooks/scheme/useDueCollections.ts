// FILE: src/hooks/scheme/useDueCollections.ts

import {
  useGetDuesTodayQuery,
  useGetOverdueDuesQuery,
  useGetUpcomingDuesQuery,
} from '@/store/api/schemeApi'

// ─────────────────────────────────────────────
// DUES TODAY
// ─────────────────────────────────────────────
export const useDuesToday = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetDuesTodayQuery(
      { shopId },
      { skip: !shopId }
    )

  return {
    dues:      data || [],
    count:     data?.length || 0,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// OVERDUE
// ─────────────────────────────────────────────
export const useOverdueDues = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetOverdueDuesQuery(
      { shopId },
      { skip: !shopId }
    )

  return {
    dues:      data || [],
    count:     data?.length || 0,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// UPCOMING DUES
// ─────────────────────────────────────────────
export const useUpcomingDues = (shopId: string, days?: number) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetUpcomingDuesQuery(
      { shopId, days },
      { skip: !shopId }
    )

  return {
    dues:      data || [],
    count:     data?.length || 0,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}