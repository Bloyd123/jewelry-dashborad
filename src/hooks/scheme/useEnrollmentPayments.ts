// FILE: src/hooks/scheme/useEnrollmentPayments.ts

import {
  useGetEnrollmentPaymentsQuery,
  useGetInstallmentScheduleQuery,
  useCalculateMaturityQuery,
} from '@/store/api/schemeApi'

// ─────────────────────────────────────────────
// ENROLLMENT PAYMENTS
// ─────────────────────────────────────────────
export const useEnrollmentPayments = (
  shopId: string,
  enrollmentId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetEnrollmentPaymentsQuery(
      { shopId, enrollmentId },
      { skip: !shopId || !enrollmentId }
    )

  return {
    payments:  data || [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// INSTALLMENT SCHEDULE
// ─────────────────────────────────────────────
export const useInstallmentSchedule = (
  shopId: string,
  enrollmentId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetInstallmentScheduleQuery(
      { shopId, enrollmentId },
      { skip: !shopId || !enrollmentId }
    )

  return {
    schedule:  data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// MATURITY VALUE
// ─────────────────────────────────────────────
export const useMaturityValue = (
  shopId: string,
  enrollmentId: string
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useCalculateMaturityQuery(
      { shopId, enrollmentId },
      { skip: !shopId || !enrollmentId }
    )

  return {
    maturity:  data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}