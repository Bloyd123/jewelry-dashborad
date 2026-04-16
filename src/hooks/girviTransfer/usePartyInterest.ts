// FILE: src/hooks/girviTransfer/usePartyInterest.ts

import { useState, useCallback } from 'react'
import {
  useCalculatePartyInterestQuery,
  useLazyCalculatePartyInterestQuery,
} from '@/store/api/girviTransferApi'

// ── Auto calculate (on mount) ────────────────────────────────────────────────
export const usePartyInterest = (
  shopId:     string,
  girviId:    string,
  transferId: string,
  toDate?:    string
) => {
  const { data: calculation, isLoading, error, refetch } =
    useCalculatePartyInterestQuery(
      { shopId, girviId, transferId, toDate },
      { skip: !shopId || !girviId || !transferId }
    )

  return {
    calculation,
    isLoading,
    error,
    refetch,
  }
}

// ── Manual calculate (on button click) ──────────────────────────────────────
export const usePartyInterestLazy = (
  shopId:     string,
  girviId:    string,
  transferId: string
) => {
  const [trigger, { data: calculation, isLoading, error }] =
    useLazyCalculatePartyInterestQuery()

  const calculate = useCallback(
    (toDate?: string) => {
      trigger({ shopId, girviId, transferId, toDate })
    },
    [trigger, shopId, girviId, transferId]
  )

  return {
    calculate,
    calculation,
    isLoading,
    error,
  }
}