// FILE: src/features/shops/hooks/useShopActions.ts

import { useCallback } from 'react'
import {
  useUpdateShopMutation,
  useDeleteShopMutation,
} from '@/store/api/ShopApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ShopFormData } from '@/types/shop.types'

  export const useShopActions = (shopId: string = '') => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [updateMutation, updateState] = useUpdateShopMutation()
  const [deleteMutation, deleteState] = useDeleteShopMutation()

  const updateShop = useCallback(
    async (
      data: Partial<ShopFormData>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ id: shopId, data }).unwrap()
        showSuccess(result.message || 'Shop updated successfully', 'Shop Updated')
        return { success: true, data: result.data }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error?.data?.message || 'Failed to update shop' }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

const deleteShop = useCallback(
  async (id?: string) => {
    const targetId = id || shopId
    try {
      const result = await deleteMutation(targetId).unwrap()
        showSuccess(result.message || 'Shop deleted successfully', 'Shop Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error?.data?.message || 'Failed to delete shop' }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  return {
    updateShop,
    deleteShop,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    updateState,
    deleteState,
  }
}