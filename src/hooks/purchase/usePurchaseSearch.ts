// FILE: src/hooks/purchase/usePurchaseSearch.ts

import { useState, useCallback } from 'react'
import {
  useSearchPurchasesQuery,
  useLazySearchPurchasesQuery,
  useGetPurchasesByDateRangeQuery,
  useGetPurchasesBySupplierQuery,
} from '@/store/api/purchaseApi'

// ── Live search (auto triggers on query change) ──
export const usePurchaseSearch = (shopId: string, q: string, limit = 20) => {
  const { data: results, isLoading, isFetching } = useSearchPurchasesQuery(
    { shopId, q, limit },
    { skip: !q || q.trim().length < 1 }
  )

  return {
    results:   results ?? [],
    isLoading: isLoading || isFetching,
  }
}

// ── Manual search (trigger on button click) ──
export const usePurchaseSearchLazy = (shopId: string) => {
  const [trigger, { data: results, isLoading }] = useLazySearchPurchasesQuery()

  const search = useCallback(
    (q: string, limit = 20) => {
      if (q.trim().length < 1) return
      trigger({ shopId, q, limit })
    },
    [trigger, shopId]
  )

  return {
    search,
    results:   results ?? [],
    isLoading,
  }
}

// ── Search by date range ──
export const usePurchasesByDateRange = (
  shopId: string,
  startDate: string,
  endDate: string,
  page = 1,
  limit = 20
) => {
  const { data, isLoading } = useGetPurchasesByDateRangeQuery(
    { shopId, startDate, endDate, page, limit },
    { skip: !startDate || !endDate }
  )

  return {
    purchases:  data?.data?.purchases ?? [],
    pagination: data?.data,
    isLoading,
  }
}

// ── Search by supplier ──
export const usePurchasesBySupplier = (
  shopId: string,
  supplierId: string,
  filters?: { page?: number; limit?: number; status?: string; paymentStatus?: string }
) => {
  const { data, isLoading } = useGetPurchasesBySupplierQuery(
    { shopId, supplierId, ...filters },
    { skip: !supplierId }
  )

  return {
    purchases:  data?.data?.purchases ?? [],
    pagination: data?.data,
    isLoading,
  }
}