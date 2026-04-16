// FILE: src/features/girvi/hooks/useGirviList.ts

import { useState, useCallback } from 'react'
import {
  useGetAllGirvisQuery,
  useGetGirviStatisticsQuery,
} from '@/store/api/girviApi'
import type { GetGirvisFilters, GirviStatus } from '@/types/girvi.types'

// MAIN GIRVIS LIST (with filters + pagination)
export const useGirviList = (
  shopId: string,
  initialFilters?: Partial<GetGirvisFilters>
) => {
  const [filters, setFilters] = useState<GetGirvisFilters>({
    page:  1,
    limit: 20,
    sort:  '-girviDate',
    ...initialFilters,
  })

  const { data, isLoading, isFetching, error, refetch } = useGetAllGirvisQuery(
    { shopId, ...filters },
    { skip: !shopId }
  )

  const updateFilter = useCallback(
    (key: keyof GetGirvisFilters, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
    },
    []
  )

  const updateFilters = useCallback(
    (newFilters: Partial<GetGirvisFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20, sort: '-girviDate' })
  }, [])

  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return {
    girvis:     data?.data?.girvis     ?? [],
    stats:      data?.data?.stats,
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

// ACTIVE GIRVIS ONLY
export const useActiveGirvis = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetAllGirvisQuery(
    { shopId, status: 'active', limit: 100 },
    { skip: !shopId }
  )

  return {
    girvis:    data?.data?.girvis ?? [],
    count:     data?.data?.girvis?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// OVERDUE GIRVIS
export const useOverdueGirvis = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetAllGirvisQuery(
    { shopId, overdueOnly: true, limit: 100 },
    { skip: !shopId }
  )

  return {
    girvis:    data?.data?.girvis ?? [],
    count:     data?.data?.girvis?.length ?? 0,
    isLoading,
    error,
    refetch,
  }
}

// GIRVIS BY STATUS
export const useGirvisByStatus = (shopId: string, status: GirviStatus) => {
  const { data, isLoading, isFetching, error, refetch } = useGetAllGirvisQuery(
    { shopId, status, limit: 50 },
    { skip: !shopId }
  )

  return {
    girvis:    data?.data?.girvis ?? [],
    count:     data?.data?.girvis?.length ?? 0,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// GIRVIS BY CUSTOMER
export const useCustomerGirvis = (shopId: string, customerId: string) => {
  const { data, isLoading, isFetching, error, refetch } = useGetAllGirvisQuery(
    { shopId, customerId, limit: 50, sort: '-girviDate' },
    { skip: !shopId || !customerId }
  )

  return {
    girvis:    data?.data?.girvis ?? [],
    count:     data?.data?.girvis?.length ?? 0,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// GIRVI STATISTICS (standalone hook)
export const useGirviStatistics = (shopId: string) => {
  const { data, isLoading, error, refetch } = useGetGirviStatisticsQuery(
    { shopId },
    { skip: !shopId }
  )

  return {
    stats:               data,
    totalGirvis:         data?.totalGirvis         ?? 0,
    activeGirvis:        data?.activeGirvis         ?? 0,
    releasedGirvis:      data?.releasedGirvis       ?? 0,
    overdueGirvis:       data?.overdueGirvis        ?? 0,
    transferredGirvis:   data?.transferredGirvis    ?? 0,
    totalPrincipalGiven: data?.totalPrincipalGiven  ?? 0,
    totalOutstanding:    data?.totalOutstanding     ?? 0,
    totalAccruedInterest: data?.totalAccruedInterest ?? 0,
    totalAmountDue:      data?.totalAmountDue       ?? 0,
    totalItemsValue:     data?.totalItemsValue      ?? 0,
    avgInterestRate:     data?.avgInterestRate      ?? 0,
    isLoading,
    error,
    refetch,
  }
}