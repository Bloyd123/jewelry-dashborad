// FILE: src/features/payment/hooks/usePaymentsList.ts

import { useState, useCallback } from 'react'
import {
  useGetAllPaymentsQuery,
  useGetPendingChequesQuery,
  useGetBouncedChequesQuery,
  useGetClearedChequesQuery,
  useGetUnreconciledPaymentsQuery,
  useGetPendingPaymentsQuery,
  useGetFailedPaymentsQuery,
  useGetTodayPaymentsQuery,
  useGetRefundsQuery,
  useGetPartyPaymentsQuery,
  useGetCustomerPaymentsQuery,
  useGetSupplierPaymentsQuery,
  useGetSalePaymentsQuery,
  useGetPurchasePaymentsQuery,
  useGetPaymentsByDateRangeQuery,
  useGetPaymentsByAmountRangeQuery,
} from '@/store/api/paymentApi'
import type { PaymentFilters } from '@/types/payment.types'

// ─────────────────────────────────────────────
// MAIN PAYMENTS LIST
// ─────────────────────────────────────────────
export const usePaymentsList = (shopId: string, initialFilters?: Partial<PaymentFilters>) => {
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 20,
    sort: '-paymentDate',
    ...initialFilters,
  })

  const { data, isLoading, isFetching, error, refetch } = useGetAllPaymentsQuery(
    { shopId, ...filters },
    { skip: !shopId }
  )

  const updateFilter = useCallback((key: keyof PaymentFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const updateFilters = useCallback((newFilters: Partial<PaymentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20, sort: '-paymentDate' })
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    payments:   data?.data ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    goToPage,
    refetch,
  }
}

// ─────────────────────────────────────────────
// TODAY'S PAYMENTS
// ─────────────────────────────────────────────
export const useTodayPayments = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetTodayPaymentsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    payments:    data?.payments    ?? [],
    totalByMode: data?.totalByMode ?? [],
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// PENDING PAYMENTS
// ─────────────────────────────────────────────
export const usePendingPayments = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetPendingPaymentsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    payments:  data ?? [],
    count:     data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// FAILED PAYMENTS
// ─────────────────────────────────────────────
export const useFailedPayments = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetFailedPaymentsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    payments:  data ?? [],
    count:     data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// CHEQUE LISTS
// ─────────────────────────────────────────────
export const usePendingCheques = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetPendingChequesQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    cheques:  data ?? [],
    count:    data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

export const useBouncedCheques = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetBouncedChequesQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    cheques:  data ?? [],
    count:    data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

export const useClearedCheques = (
  shopId: string,
  dateRange?: { startDate?: string; endDate?: string }
) => {
  const { data, isLoading, error, refetch } = useGetClearedChequesQuery(
    { shopId, ...dateRange },
    { skip: !shopId }
  )

  return {
    cheques:  data ?? [],
    count:    data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// UNRECONCILED PAYMENTS
// ─────────────────────────────────────────────
export const useUnreconciledPayments = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetUnreconciledPaymentsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    payments:  data ?? [],
    count:     data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// REFUNDS LIST
// ─────────────────────────────────────────────
export const useRefunds = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetRefundsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    refunds:  data ?? [],
    count:    data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// PARTY PAYMENTS
// ─────────────────────────────────────────────
export const usePartyPayments = (
  shopId: string,
  partyId: string,
  filters?: { page?: number; limit?: number; paymentType?: string; status?: string }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPartyPaymentsQuery(
    { shopId, partyId, ...filters },
    { skip: !shopId || !partyId }
  )

  return {
    payments:   data?.data       ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

export const useCustomerPayments = (
  shopId: string,
  customerId: string,
  filters?: { page?: number; limit?: number }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetCustomerPaymentsQuery(
    { shopId, customerId, ...filters },
    { skip: !shopId || !customerId }
  )

  return {
    payments:   data?.data       ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

export const useSupplierPayments = (
  shopId: string,
  supplierId: string,
  filters?: { page?: number; limit?: number }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetSupplierPaymentsQuery(
    { shopId, supplierId, ...filters },
    { skip: !shopId || !supplierId }
  )

  return {
    payments:   data?.data       ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// REFERENCE PAYMENTS (sale / purchase)
// ─────────────────────────────────────────────
export const useSalePayments = (shopId: string, saleId: string) => {
  const { data, isLoading, error, refetch } = useGetSalePaymentsQuery(
    { shopId, saleId },
    { skip: !shopId || !saleId }
  )

  return {
    payments:  data ?? [],
    count:     data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

export const usePurchasePayments = (shopId: string, purchaseId: string) => {
  const { data, isLoading, error, refetch } = useGetPurchasePaymentsQuery(
    { shopId, purchaseId },
    { skip: !shopId || !purchaseId }
  )

  return {
    payments:  data ?? [],
    count:     data?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// DATE RANGE PAYMENTS
// ─────────────────────────────────────────────
export const usePaymentsByDateRange = (
  shopId: string,
  startDate: string,
  endDate: string,
  filters?: { page?: number; limit?: number }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPaymentsByDateRangeQuery(
    { shopId, startDate, endDate, ...filters },
    { skip: !shopId || !startDate || !endDate }
  )

  return {
    payments:   data?.data       ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}

// ─────────────────────────────────────────────
// AMOUNT RANGE PAYMENTS
// ─────────────────────────────────────────────
export const usePaymentsByAmountRange = (
  shopId: string,
  minAmount: number,
  maxAmount: number,
  filters?: { page?: number; limit?: number }
) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPaymentsByAmountRangeQuery(
    { shopId, minAmount, maxAmount, ...filters },
    { skip: !shopId || minAmount == null || maxAmount == null }
  )

  return {
    payments:   data?.data       ?? [],
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    refetch,
  }
}