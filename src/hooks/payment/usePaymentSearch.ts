// FILE: src/features/payment/hooks/usePaymentSearch.ts

import { useState, useCallback, useEffect } from 'react'
import {
  useSearchPaymentsQuery,
  useLazySearchPaymentsQuery,
} from '@/store/api/paymentApi'

// ─────────────────────────────────────────────
// DEBOUNCED SEARCH (auto-fires as user types)
// ─────────────────────────────────────────────
export const usePaymentSearch = (shopId: string, debounceMs = 400) => {
  const [query, setQuery]       = useState('')
  const [debouncedQ, setDebQ]   = useState('')
  const [limit, setLimit]       = useState(50)

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebQ(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, debounceMs])

  const { data, isLoading, isFetching, error } = useSearchPaymentsQuery(
    { shopId, q: debouncedQ, limit },
    { skip: !shopId || debouncedQ.trim().length < 2 }
  )

  const clear = useCallback(() => {
    setQuery('')
    setDebQ('')
  }, [])

  return {
    query,
    setQuery,
    results:     data ?? [],
    count:       data?.length ?? 0,
    isSearching: isLoading || isFetching,
    error,
    limit,
    setLimit,
    clear,
    hasQuery:    debouncedQ.trim().length >= 2,
  }
}

// ─────────────────────────────────────────────
// MANUAL / LAZY SEARCH (fires on demand)
// ─────────────────────────────────────────────
export const usePaymentSearchLazy = (shopId: string) => {
  const [trigger, { data, isLoading, isFetching, error, isUninitialized }] =
    useLazySearchPaymentsQuery()

  const search = useCallback(
    (q: string, limit?: number) => {
      if (!shopId || q.trim().length < 2) return
      trigger({ shopId, q: q.trim(), limit })
    },
    [shopId, trigger]
  )

  return {
    search,
    results:     data ?? [],
    count:       data?.length ?? 0,
    isSearching: isLoading || isFetching,
    error,
    isUninitialized,
  }
}