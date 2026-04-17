// FILE: src/hooks/girviCashbook/useGirviCashbookSummary.ts

import {
  useGetCashbookBalanceQuery,
  useGetDailySummaryQuery,
  useGetMonthlySummaryQuery,
  useGetYearlySummaryQuery,
} from '@/store/api/girviCashbookApi'

export const useCashbookBalance = (shopId: string) => {
  const { data, isLoading, error, refetch } =
    useGetCashbookBalanceQuery(
      { shopId },
      { skip: !shopId }
    )

  return {
    currentBalance: data?.currentBalance ?? 0,
    isLoading,
    error,
    refetch,
  }
}

export const useDailySummary = (shopId: string, date?: string) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetDailySummaryQuery(
      { shopId, date },
      { skip: !shopId }
    )

  return {
    summary:   data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

export const useMonthlySummary = (
  shopId: string,
  year?:  number,
  month?: number
) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetMonthlySummaryQuery(
      {
        shopId,
        year:  year  ?? new Date().getFullYear(),
        month: month ?? new Date().getMonth() + 1,
      },
      { skip: !shopId }
    )

  return {
    summary:   data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}

export const useYearlySummary = (shopId: string, year?: number) => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetYearlySummaryQuery(
      {
        shopId,
        year: year ?? new Date().getFullYear(),
      },
      { skip: !shopId }
    )

  return {
    summary:   data,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  }
}