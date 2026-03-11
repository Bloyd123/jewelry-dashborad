//
// FILE: src/features/shops/hooks/useShopSettings.ts
//

import { useCallback } from 'react'
import {
  useUpdateShopSettingsMutation,
  useUpdateMetalRatesMutation,
} from '@/store/api/ShopApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  MetalRatesUpdatePayload,
  ShopSettingsUpdatePayload,
} from '@/types/shop.types'

export const useShopSettings = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [updateSettingsMutation,   updateSettingsState]   = useUpdateShopSettingsMutation()
  const [updateMetalRatesMutation, updateMetalRatesState] = useUpdateMetalRatesMutation()

  // UPDATE SETTINGS
  const updateSettings = useCallback(
    async (
      settings: ShopSettingsUpdatePayload['settings'],
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateSettingsMutation({ shopId, settings }).unwrap()
        showSuccess('Settings saved successfully!', 'Settings Saved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [updateSettingsMutation, shopId, handleError, showSuccess]
  )

  // UPDATE METAL RATES
  const updateMetalRates = useCallback(
    async (rates: MetalRatesUpdatePayload) => {
      try {
        const result = await updateMetalRatesMutation({ shopId, ...rates }).unwrap()
        showSuccess('Metal rates updated successfully!', 'Rates Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [updateMetalRatesMutation, shopId, handleError, showSuccess]
  )

  return {
    updateSettings,
    updateMetalRates,
    isUpdatingSettings:   updateSettingsState.isLoading,
    isUpdatingMetalRates: updateMetalRatesState.isLoading,
  }
}