// FILE: src/hooks/scheme/useSchemeAnalytics.ts

import {
  useGetSchemeAnalyticsQuery,
  useGetSchemeDashboardQuery,
  useGetSchemeSpecificAnalyticsQuery,
} from '@/store/api/schemeApi'

// ─────────────────────────────────────────────
// OVERALL ANALYTICS
// ─────────────────────────────────────────────
export const useSchemeAnalytics = (
  shopId: string,
  filters?: { startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemeAnalyticsQuery(
      { shopId, ...filters },
      { skip: !shopId }
    )

  return {
    analytics: data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export const useSchemeDashboard = (shopId: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemeDashboardQuery(
      { shopId },
      { skip: !shopId }
    )

  return {
    dashboard: data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// SCHEME SPECIFIC ANALYTICS
// ─────────────────────────────────────────────
export const useSchemeSpecificAnalytics = (
  shopId: string,
  schemeId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemeSpecificAnalyticsQuery(
      { shopId, schemeId },
      { skip: !shopId || !schemeId }
    )

  return {
    analytics: data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}