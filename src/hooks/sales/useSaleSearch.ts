// FILE: src/features/sales/hooks/useSaleSearch.ts

import { useState, useCallback } from 'react'
import {
  useSearchSalesQuery,
  useLazySearchSalesQuery,
  useGetSalesByDateRangeQuery,
  useGetSalesByAmountRangeQuery,
} from '@/store/api/salesApi'

// ─────────────────────────────────────────────
// SALE SEARCH HOOK
// ─────────────────────────────────────────────
export const useSaleSearch = (shopId: string) => {
  const [searchTerm, setSearchTerm]       = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // ─── Debounce helper ─────────────────────
  let debounceTimer: ReturnType<typeof setTimeout>
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        setDebouncedTerm(value)
      }, 400)
    },
    []
  )

  // ─── Auto Search (fires when debouncedTerm changes) ──
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useSearchSalesQuery(
    { shopId, q: debouncedTerm, limit: 20 },
    { skip: debouncedTerm.length < 2 }   // min 2 chars — matches backend validation
  )

  // ─── Lazy Search (manual trigger) ────────
  const [triggerSearch, lazySearchState] = useLazySearchSalesQuery()

  const searchNow = useCallback(
    async (q: string, limit?: number) => {
      if (q.length < 2) return []
      const result = await triggerSearch({ shopId, q, limit }).unwrap()
      return result || []
    },
    [triggerSearch, shopId]
  )

  // ─── Date Range Search ────────────────────
  const [dateRange, setDateRange] = useState<{
    startDate: string
    endDate: string
    page: number
    limit: number
  } | null>(null)

  const {
    data: dateRangeResults,
    isLoading: isDateRangeLoading,
  } = useGetSalesByDateRangeQuery(
    { shopId, ...dateRange! },
    { skip: !dateRange }
  )

  const searchByDateRange = useCallback(
    (startDate: string, endDate: string, page = 1, limit = 10) => {
      setDateRange({ startDate, endDate, page, limit })
    },
    []
  )

  // ─── Amount Range Search ──────────────────
  const [amountRange, setAmountRange] = useState<{
    minAmount: number
    maxAmount: number
    page: number
    limit: number
  } | null>(null)

  const {
    data: amountRangeResults,
    isLoading: isAmountRangeLoading,
  } = useGetSalesByAmountRangeQuery(
    { shopId, ...amountRange! },
    { skip: !amountRange }
  )

  const searchByAmountRange = useCallback(
    (minAmount: number, maxAmount: number, page = 1, limit = 10) => {
      setAmountRange({ minAmount, maxAmount, page, limit })
    },
    []
  )

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setDebouncedTerm('')
  }, [])

  return {
    // ── Search State ──────────────────────
    searchTerm,
    handleSearchChange,
    clearSearch,

    // ── Auto Search Results ───────────────
    searchResults:     searchResults     || [],
    isSearchLoading:   isSearchLoading   || isSearchFetching,

    // ── Lazy Search ───────────────────────
    searchNow,
    isLazySearchLoading: lazySearchState.isLoading,

    // ── Date Range ────────────────────────
    dateRangeResults:  dateRangeResults?.data?.sales || [],
    dateRangeTotal:    dateRangeResults?.data?.total || 0,
    isDateRangeLoading,
    searchByDateRange,

    // ── Amount Range ──────────────────────
    amountRangeResults: amountRangeResults?.data?.sales || [],
    amountRangeTotal:   amountRangeResults?.data?.total || 0,
    isAmountRangeLoading,
    searchByAmountRange,
  }
}