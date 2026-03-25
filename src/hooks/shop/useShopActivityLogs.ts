// FILE: src/features/shops/hooks/useShopActivityLogs.ts

import { useState, useCallback } from 'react'
import { useGetShopActivityLogsQuery } from '@/store/api/ShopApi'
import type { ActivityLogQueryParams } from '@/types/shop.types'

export const useShopActivityLogs = (shopId: string) => {
  const [filters, setFilters] = useState<Omit<ActivityLogQueryParams, 'id'>>({
    page: 1,
    limit: 20,
    sort: '-createdAt',
  })

  const { data, isLoading, isFetching, error, refetch } = useGetShopActivityLogsQuery(
    { id: shopId, ...filters },
    { skip: !shopId }
  )

  const updateFilters = useCallback(
    (newFilters: Partial<Omit<ActivityLogQueryParams, 'id'>>) => {
      setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
    },
    []
  )

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20, sort: '-createdAt' })
  }, [])

  return {
    logs: data?.data || [],
    pagination: data?.pagination || null,
    isLoading: isLoading || isFetching,
    error,
    refetch,
    filters,
    updateFilters,
    setPage,
    resetFilters,
  }
}