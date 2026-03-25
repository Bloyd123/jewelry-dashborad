// FILE: src/features/product/hooks/useProductReservation.ts

import { useCallback } from 'react'
import {
  useReserveProductMutation,
  useCancelReservationMutation,
  useMarkAsSoldMutation,
} from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ReserveProductInput, MarkAsSoldInput } from '@/types/product.types'

export const useProductReservation = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [reserveMutation, reserveState]   = useReserveProductMutation()
  const [cancelMutation, cancelState]     = useCancelReservationMutation()
  const [soldMutation, soldState]         = useMarkAsSoldMutation()

  // ── RESERVE ───────────────────────────────────────────────────
  const reserveProduct = useCallback(
    async (data: ReserveProductInput) => {
      try {
        const result = await reserveMutation({ shopId, ...data }).unwrap()
        showSuccess('Product reserved successfully!', 'Reserved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Reservation failed' }
      }
    },
    [reserveMutation, shopId, handleError, showSuccess]
  )

  // ── CANCEL RESERVATION ────────────────────────────────────────
  const cancelReservation = useCallback(
    async (id: string) => {
      try {
        const result = await cancelMutation({ shopId, id }).unwrap()
        showSuccess('Reservation cancelled!', 'Cancelled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Cancel failed' }
      }
    },
    [cancelMutation, shopId, handleError, showSuccess]
  )

  // ── MARK AS SOLD ──────────────────────────────────────────────
  const markAsSold = useCallback(
    async (data: MarkAsSoldInput) => {
      try {
        const result = await soldMutation({ shopId, ...data }).unwrap()
        showSuccess('Product marked as sold!', 'Sold')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message || 'Mark as sold failed' }
      }
    },
    [soldMutation, shopId, handleError, showSuccess]
  )

  return {
    // Actions
    reserveProduct,
    cancelReservation,
    markAsSold,

    // Loading states
    isReserving:      reserveState.isLoading,
    isCancelling:     cancelState.isLoading,
    isMarkingAsSold:  soldState.isLoading,

    // Raw states
    reserveState,
    cancelState,
    soldState,
  }
}