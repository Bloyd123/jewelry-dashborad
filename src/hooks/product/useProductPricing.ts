// FILE: src/features/product/hooks/useProductPricing.ts

import { useCallback } from 'react'
import { useCalculatePriceMutation } from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { CalculatePriceInput } from '@/types/product.types'

export const useProductPricing = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [calculateMutation, calculateState] = useCalculatePriceMutation()

  const calculatePrice = useCallback(
      async (id: string, data: Omit<CalculatePriceInput, 'id'>) => {
      try {
           const result = await calculateMutation({ shopId, id, ...data }).unwrap()
        showSuccess(
          `Price updated: ₹${result.newPrice.toLocaleString('en-IN')}`,
          'Price Recalculated'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Price calculation failed' }
      }
    },
    [calculateMutation, shopId, handleError, showSuccess]
  )

  return {
    calculatePrice,
    isCalculating: calculateState.isLoading,
    calculateState,
  }
}