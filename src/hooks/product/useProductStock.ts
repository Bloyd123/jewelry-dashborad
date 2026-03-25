// FILE: src/features/product/hooks/useProductStock.ts

import { useCallback } from 'react'
import { useUpdateStockMutation } from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { UpdateStockInput } from '@/types/product.types'

export const useProductStock = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [updateStockMutation, updateStockState] = useUpdateStockMutation()

  const updateStock = useCallback(
    async (data: UpdateStockInput) => {
      try {
        const result = await updateStockMutation({ shopId, ...data }).unwrap()
        showSuccess(
          `Stock updated: ${data.operation} ${data.quantity}`,
          'Stock Updated'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Stock update failed' }
      }
    },
    [updateStockMutation, shopId, handleError, showSuccess]
  )

  return {
    updateStock,
    isUpdatingStock: updateStockState.isLoading,
    stockState: updateStockState,
  }
}