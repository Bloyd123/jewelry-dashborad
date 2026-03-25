// FILE: src/features/shops/hooks/useShopSettings.ts

import { useCallback } from 'react'
import { useUpdateShopSettingsMutation } from '@/store/api/ShopApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ShopSettingsUpdatePayload } from '@/types/shop.types'

export const useShopSettings = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [updateSettingsMutation, updateState] = useUpdateShopSettingsMutation()

  const updateSettings = useCallback(
    async (
      settings: ShopSettingsUpdatePayload['settings'],
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateSettingsMutation({ id: shopId, settings }).unwrap()
        showSuccess('Shop settings updated successfully', 'Settings Saved')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error?.data?.message || 'Failed to update settings' }
      }
    },
    [updateSettingsMutation, shopId, handleError, showSuccess]
  )

  return {
    updateSettings,
    isUpdating: updateState.isLoading,
    updateState,
  }
}