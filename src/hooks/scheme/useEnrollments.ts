// FILE: src/hooks/scheme/useEnrollments.ts

import { useMemo } from 'react'
import {
  useGetSchemeEnrollmentsQuery,
  useGetCustomerEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useGetMaturingSoonQuery,
  useGetMaturedEnrollmentsQuery,
  useGetCustomerSchemeSummaryQuery,
} from '@/store/api/schemeApi'
export const useSchemeEnrollments = (
  shopId: string,
  schemeId: string,
  filters?: { page?: number; limit?: number; status?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetSchemeEnrollmentsQuery(
      { shopId, schemeId, ...filters },
      { skip: !shopId || !schemeId }
    )

  const enrollments = useMemo(() => data?.data?.enrollments || [], [data])
  const pagination  = useMemo(() => {
    const p = data?.meta?.pagination
    if (!p) return undefined
    return {
      page:    p.page    ?? 1,
      pages:   p.pages   ?? 1,
      total:   p.total   ?? 0,
      limit:   p.limit   ?? 20,
      hasNext: p.hasNext ?? false,
      hasPrev: p.hasPrev ?? false,
    }
  }, [data])

  return {
    enrollments,
    pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

export const useCustomerEnrollments = (
  shopId: string,
  customerId: string,
  filters?: { page?: number; limit?: number; status?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerEnrollmentsQuery(
      { shopId, customerId, ...filters },
      { skip: !shopId || !customerId }
    )

  const enrollments = useMemo(() => data?.data?.enrollments || [], [data])
  const pagination  = useMemo(() => {
    const p = data?.meta?.pagination
    if (!p) return undefined
    return {
      page:    p.page    ?? 1,
      pages:   p.pages   ?? 1,
      total:   p.total   ?? 0,
      limit:   p.limit   ?? 20,
      hasNext: p.hasNext ?? false,
      hasPrev: p.hasPrev ?? false,
    }
  }, [data])

  return {
    enrollments,
    pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// SINGLE ENROLLMENT
// ─────────────────────────────────────────────
export const useEnrollmentById = (
  shopId: string,
  enrollmentId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetEnrollmentByIdQuery(
      { shopId, enrollmentId },
      { skip: !shopId || !enrollmentId }
    )

  return {
    enrollment: data,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// MATURING SOON
// ─────────────────────────────────────────────
export const useMaturingSoon = (shopId: string, days?: number) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetMaturingSoonQuery(
      { shopId, days },
      { skip: !shopId }
    )

  return {
    enrollments: data || [],
    isLoading:   isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// MATURED ENROLLMENTS
// ─────────────────────────────────────────────
export const useMaturedEnrollments = (
  shopId: string,
  filters?: { page?: number; limit?: number; startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetMaturedEnrollmentsQuery(
      { shopId, ...filters },
      { skip: !shopId }
    )

  const enrollments = useMemo(() => data?.data?.enrollments || [], [data])
  const pagination  = useMemo(() => {
    const p = data?.meta?.pagination
    if (!p) return undefined
    return {
      page:    p.page    ?? 1,
      pages:   p.pages   ?? 1,
      total:   p.total   ?? 0,
      limit:   p.limit   ?? 20,
      hasNext: p.hasNext ?? false,
      hasPrev: p.hasPrev ?? false,
    }
  }, [data])

  return {
    enrollments,
    pagination,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// CUSTOMER SCHEME SUMMARY
// ─────────────────────────────────────────────
export const useCustomerSchemeSummary = (
  shopId: string,
  customerId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetCustomerSchemeSummaryQuery(
      { shopId, customerId },
      { skip: !shopId || !customerId }
    )

  return {
    summary:   data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}