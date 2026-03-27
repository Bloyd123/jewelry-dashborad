// FILE: src/features/metal-rates/hooks/useMetalRate.ts
import { useCallback } from 'react'
import {
  useCreateOrUpdateTodayRateMutation,
  useGetCurrentRateQuery,
  useGetRateHistoryQuery,
  useGetLatestRatesQuery,
  useGetTrendChartDataQuery,
  useLazyCompareRatesQuery,
  useLazyGetRateByDateQuery,
  useGetRateForPurityQuery,
  useGetAverageRateQuery,
  useSyncToAllShopsMutation,
  useGetOrganizationRateQuery,
  useDeactivateRateMutation,
  useDeleteRateMutation,
} from '@/store/api/metalRateApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateMetalRatePayload,
  SyncToAllShopsPayload,
  RateHistoryParams,
  TrendDataParams,
  AverageRateParams,
  MetalType,
} from '@/types/metalrate.types'

export const useMetalRate = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()
  const [createOrUpdateMutation, createOrUpdateState] = useCreateOrUpdateTodayRateMutation()
  const [syncMutation, syncState]                     = useSyncToAllShopsMutation()
  const [deactivateMutation, deactivateState]         = useDeactivateRateMutation()
  const [deleteMutation, deleteState]                 = useDeleteRateMutation()
  const [triggerCompare, compareResult]   = useLazyCompareRatesQuery()
  const [triggerGetByDate, byDateResult]  = useLazyGetRateByDateQuery()

  const createOrUpdateTodayRate = useCallback(
    async (
      data: CreateMetalRatePayload,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createOrUpdateMutation({ shopId, ...data }).unwrap()
        showSuccess(result.message || 'Metal rates saved successfully!', 'Rates Saved')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message || 'Failed to save rates' }
      }
    },
    [createOrUpdateMutation, shopId, handleError, showSuccess]
  )
  const syncToAllShops = useCallback(
    async (organizationId: string, data: SyncToAllShopsPayload) => {
      try {
        const result = await syncMutation({ ...data , organizationId,}).unwrap()
        showSuccess(result.message || 'Rates synced successfully!', 'Sync Complete')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Sync failed' }
      }
    },
    [syncMutation, handleError, showSuccess]
  )

  const deactivateRate = useCallback(
    async (rateId: string) => {
      try {
        const result = await deactivateMutation({ rateId, shopId }).unwrap()
        showSuccess(result.message || 'Rate deactivated successfully!', 'Rate Deactivated')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to deactivate rate' }
      }
    },
    [deactivateMutation, shopId, handleError, showSuccess]
  )

  const deleteRate = useCallback(
    async (rateId: string) => {
      try {
        await deleteMutation({ rateId, shopId }).unwrap()
        showSuccess('Rate deleted successfully!', 'Rate Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to delete rate' }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  const compareRates = useCallback(
    async (fromDate: string, toDate: string) => {
      try {
        const result = await triggerCompare({ shopId, fromDate, toDate }).unwrap()
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Failed to compare rates' }
      }
    },
    [triggerCompare, shopId, handleError]
  )

  const getRateByDate = useCallback(
    async (date: string) => {
      try {
        const result = await triggerGetByDate({ shopId, date }).unwrap()
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'No rate found for this date' }
      }
    },
    [triggerGetByDate, shopId, handleError]
  )

  return {
    createOrUpdateTodayRate,
    syncToAllShops,
    deactivateRate,
    deleteRate,
    compareRates,
    getRateByDate,

    isSaving:       createOrUpdateState.isLoading,
    isSyncing:      syncState.isLoading,
    isDeactivating: deactivateState.isLoading,
    isDeleting:     deleteState.isLoading,
    isComparing:    compareResult.isLoading,
    compareData:  compareResult.data?.data,
    byDateData:   byDateResult.data?.data,
  }
}

export const useCurrentRate = (shopId: string) => {
  const { data, isLoading, isFetching, error } = useGetCurrentRateQuery({ shopId })
  return {
    currentRate:      data?.data,
    isLoading:        isLoading || isFetching,
    isCached:         data?.cached,
    error,
  }
}

export const useRateHistory = (shopId: string, params?: Partial<RateHistoryParams>) => {
  const { data, isLoading, isFetching, error } = useGetRateHistoryQuery({ shopId, ...params })
  return {
    rates:      data?.data || [],
    pagination: data?.meta?.pagination,
    isLoading:  isLoading || isFetching,
    error,
  }
}

export const useLatestRates = (shopId: string, limit = 10) => {
  const { data, isLoading, error } = useGetLatestRatesQuery({ shopId, limit })
  return {
    latestRates: data?.data || [],
    isLoading,
    error,
  }
}

export const useTrendChartData = (shopId: string, params?: Partial<TrendDataParams>) => {
  const { data, isLoading, isFetching, error } = useGetTrendChartDataQuery({
    shopId,
    metalType: params?.metalType || 'gold',
    days: params?.days || 90,
  })
  return {
    trendData:  data?.data,
    isCached:   data?.cached,
    isLoading:  isLoading || isFetching,
    error,
  }
}

export const useRateForPurity = (shopId: string, metalType: MetalType, purity: string) => {
  const { data, isLoading, error } = useGetRateForPurityQuery({ shopId, metalType, purity })
  return {
    rateForPurity: data?.data,
    isLoading,
    error,
  }
}

export const useAverageRate = (shopId: string, params?: Partial<AverageRateParams>) => {
  const { data, isLoading, error } = useGetAverageRateQuery({ shopId, ...params })
  return {
    averageRate: data?.data,
    isLoading,
    error,
  }
}

export const useOrganizationRate = (organizationId: string) => {
  const { data, isLoading, error } = useGetOrganizationRateQuery({ organizationId })
  return {
    organizationRate: data?.data,
    isLoading,
    error,
  }
}