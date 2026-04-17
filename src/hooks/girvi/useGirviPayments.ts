// FILE: src/features/girvi/hooks/useGirviPayments.ts
import { useState, useCallback } from 'react'
import {
  useGetGirviPaymentsQuery,
  useGetGirviPaymentByIdQuery,
  useGetShopGirviPaymentsQuery,
} from '@/store/api/girviPaymentApi'
import type {
  GetGirviPaymentsFilters,
  GetShopGirviPaymentsFilters,
  GirviPaymentType,
  GirviPaymentMode,
} from '@/types/girvi.types'

// GET /shops/:shopId/girvi/:girviId/payments
export const useGirviPayments = (
  shopId: string,
  girviId: string,
  initialFilters?: Partial<GetGirviPaymentsFilters>
) => {
  const [filters, setFilters] = useState<GetGirviPaymentsFilters>({
    page:  1,
    limit: 20,
    sort:  '-paymentDate',
    ...initialFilters,
  })

  const { data, isLoading, isFetching, error, refetch } = useGetGirviPaymentsQuery(
    { shopId, girviId, ...filters },
    { skip: !shopId || !girviId }
  )

  const updateFilter = useCallback(
    (key: keyof GetGirviPaymentsFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20, sort: '-paymentDate' })
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    payments:   data?.data?.payments   ?? [],
    summary:    data?.data?.summary,
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    filters,
    updateFilter,
    resetFilters,
    goToPage,
    refetch,

    totalInterestReceived:  data?.data?.summary?.totalInterestReceived  ?? 0,
    totalPrincipalReceived: data?.data?.summary?.totalPrincipalReceived ?? 0,
    totalDiscountGiven:     data?.data?.summary?.totalDiscountGiven     ?? 0,
    totalNetReceived:       data?.data?.summary?.totalNetReceived       ?? 0,
    paymentCount:           data?.data?.summary?.paymentCount           ?? 0,
  }
}
// GET /shops/:shopId/girvi/:girviId/payments/:paymentId
export const useGirviPaymentById = (
  shopId: string,
  girviId: string,
  paymentId: string
) => {
  const { data: payment, isLoading, error, refetch } = useGetGirviPaymentByIdQuery(
    { shopId, girviId, paymentId },
    { skip: !shopId || !girviId || !paymentId }
  )

  return {
    payment,
    isLoading,
    error,
    refetch,
  }
}

// GET /shops/:shopId/girvi-payments
export const useShopGirviPayments = (
  shopId: string,
  initialFilters?: Partial<GetShopGirviPaymentsFilters>
) => {
  const [filters, setFilters] = useState<GetShopGirviPaymentsFilters>({
    page:  1,
    limit: 20,
    sort:  '-paymentDate',
    ...initialFilters,
  })

  const { data, isLoading, isFetching, error, refetch } = useGetShopGirviPaymentsQuery(
    { shopId, ...filters },
    { skip: !shopId }
  )

  const updateFilter = useCallback(
    (key: keyof GetShopGirviPaymentsFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
    },
    []
  )

  const updateFilters = useCallback(
    (newFilters: Partial<GetShopGirviPaymentsFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20, sort: '-paymentDate' })
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    payments:   data?.data?.payments   ?? [],
    summary:    data?.data?.summary,
    pagination: data?.pagination,
    isLoading:  isLoading || isFetching,
    error,
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    goToPage,
    refetch,

    totalInterestReceived:  data?.data?.summary?.totalInterestReceived  ?? 0,
    totalPrincipalReceived: data?.data?.summary?.totalPrincipalReceived ?? 0,
    totalDiscountGiven:     data?.data?.summary?.totalDiscountGiven     ?? 0,
    totalNetReceived:       data?.data?.summary?.totalNetReceived       ?? 0,
    totalPayments:          data?.data?.summary?.totalPayments          ?? 0,
  }
}