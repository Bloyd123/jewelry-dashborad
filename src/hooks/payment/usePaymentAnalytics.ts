// FILE: src/features/payment/hooks/usePaymentAnalytics.ts

import {
  useGetPaymentDashboardQuery,
  useGetPaymentAnalyticsQuery,
  useGetCashCollectionQuery,
  useGetDigitalCollectionQuery,
  useGetPaymentsByModeQuery,
  useGetReconciliationSummaryQuery,
} from '@/store/api/paymentApi'

// ─────────────────────────────────────────────
// PAYMENT DASHBOARD
// ─────────────────────────────────────────────
export const usePaymentDashboard = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetPaymentDashboardQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    dashboard:          data,
    todayCollection:    data?.todayCollection,
    weekCollection:     data?.weekCollection     ?? 0,
    monthCollection:    data?.monthCollection    ?? 0,
    pendingChequesCount: data?.pendingChequesCount ?? 0,
    unreconciledCount:  data?.unreconciledCount  ?? 0,
    recentPayments:     data?.recentPayments     ?? [],
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// PAYMENT ANALYTICS (time-series)
// ─────────────────────────────────────────────
export const usePaymentAnalytics = (
  shopId: string,
  options?: {
    startDate?: string
    endDate?: string
    groupBy?: 'day' | 'week' | 'month'
  }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPaymentAnalyticsQuery(
    { shopId, ...options },
    { skip: !shopId }
  )

  return {
    analytics:           data?.analytics           ?? [],
    summary:             data?.summary,
    totalReceipts:       data?.summary?.totalReceipts,
    totalPayments:       data?.summary?.totalPayments,
    netCashFlow:         data?.summary?.netCashFlow ?? 0,
    paymentModeBreakdown: data?.summary?.paymentModeBreakdown ?? [],
    isLoading:           isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// CASH COLLECTION (daily)
// ─────────────────────────────────────────────
export const useCashCollection = (shopId: string, date?: string) => {
  const { data, isLoading, error, refetch } = useGetCashCollectionQuery(
    { shopId, date },
    { skip: !shopId }
  )

  return {
    cashCollection:  data,
    cashReceived:    data?.cashReceived    ?? { amount: 0, count: 0 },
    cashPaid:        data?.cashPaid        ?? { amount: 0, count: 0 },
    netCashBalance:  data?.netCashBalance  ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// DIGITAL COLLECTION (UPI / Card / Wallet)
// ─────────────────────────────────────────────
export const useDigitalCollection = (
  shopId: string,
  dateRange?: { startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetDigitalCollectionQuery(
    { shopId, ...dateRange },
    { skip: !shopId }
  )

  return {
    breakdown:              data?.breakdown              ?? [],
    totalDigitalCollection: data?.totalDigitalCollection ?? 0,
    isLoading:              isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// PAYMENT MODE BREAKDOWN
// ─────────────────────────────────────────────
export const usePaymentsByMode = (
  shopId: string,
  dateRange?: { startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPaymentsByModeQuery(
    { shopId, ...dateRange },
    { skip: !shopId }
  )

  return {
    breakdown: data ?? [],
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// RECONCILIATION SUMMARY
// ─────────────────────────────────────────────
export const useReconciliationSummary = (
  shopId: string,
  dateRange?: { startDate?: string; endDate?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetReconciliationSummaryQuery(
    { shopId, ...dateRange },
    { skip: !shopId }
  )

  return {
    summary:          data,
    totalPayments:    data?.totalPayments    ?? 0,
    reconciled:       data?.reconciled       ?? { count: 0, amount: 0 },
    unreconciled:     data?.unreconciled     ?? { count: 0, amount: 0 },
    totalDiscrepancy: data?.totalDiscrepancy ?? 0,
    isLoading:        isLoading || isFetching,
    error,
    refetch,
  }
}