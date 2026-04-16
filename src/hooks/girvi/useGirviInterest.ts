// FILE: src/features/girvi/hooks/useGirviInterest.ts

import { useState, useCallback } from 'react'
import {
  useCalculateGirviInterestQuery,
  useLazyCalculateGirviInterestQuery,
} from '@/store/api/girviApi'
import type {
  GirviInterestType,
  GirviInterestCalculation,
} from '@/types/girvi.types'

// AUTO INTEREST CALCULATION
// Use this on the detail page — fires automatically
export const useGirviInterest = (
  shopId: string,
  girviId: string,
  options?: {
    toDate?: string
    interestType?: GirviInterestType
  }
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useCalculateGirviInterestQuery(
      { shopId, girviId, ...options },
      { skip: !shopId || !girviId }
    )

  return {
    calculation:        data,
    interestCalculated: data?.interestCalculated  ?? 0,
    totalAmountDue:     data?.totalAmountDue       ?? 0,
    principal:          data?.principal            ?? 0,
    days:               data?.days                 ?? 0,
    months:             data?.months               ?? 0,
    fromDate:           data?.fromDate,
    toDate:             data?.toDate,

    simpleInterest:     data?.comparison?.simple?.interest       ?? 0,
    simpleTotalDue:     data?.comparison?.simple?.totalAmountDue ?? 0,
    compoundInterest:   data?.comparison?.compound?.interest       ?? 0,
    compoundTotalDue:   data?.comparison?.compound?.totalAmountDue ?? 0,
    totalPrincipalPaid: data?.totalPaid?.principal ?? 0,
    totalInterestPaid:  data?.totalPaid?.interest  ?? 0,
    totalDiscountGiven: data?.totalPaid?.discount  ?? 0,

    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

// LAZY INTEREST CALCULATION
// Use this inside the release form —
// fires only when the user clicks "Calculate"
// or when releaseInterestType / paymentDate changes
export const useGirviInterestLazy = (shopId: string, girviId: string) => {
  const [lastCalculation, setLastCalculation] =
    useState<GirviInterestCalculation | null>(null)

  const [trigger, { isLoading, isFetching, error }] =
    useLazyCalculateGirviInterestQuery()

  const calculate = useCallback(
    async (options?: {
      toDate?: string
      interestType?: GirviInterestType
    }) => {
      if (!shopId || !girviId) return null

      try {
        const result = await trigger(
          { shopId, girviId, ...options },
          true  // preferCacheValue = false → always fresh
        ).unwrap()

        setLastCalculation(result)
        return result
      } catch {
        return null
      }
    },
    [trigger, shopId, girviId]
  )

  return {
    calculate,
    calculation:        lastCalculation,
    interestCalculated: lastCalculation?.interestCalculated  ?? 0,
    totalAmountDue:     lastCalculation?.totalAmountDue       ?? 0,
    principal:          lastCalculation?.principal            ?? 0,
    days:               lastCalculation?.days                 ?? 0,
    simpleInterest:     lastCalculation?.comparison?.simple?.interest       ?? 0,
    compoundInterest:   lastCalculation?.comparison?.compound?.interest       ?? 0,
    isCalculating: isLoading || isFetching,
    error,
    hasCalculation: lastCalculation !== null,
  }
}