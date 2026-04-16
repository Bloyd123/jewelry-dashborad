// FILE: src/hooks/girviTransfer/useGirviTransferActions.ts

import { useCallback } from 'react'
import {
  useTransferOutMutation,
  useTransferReturnMutation,
  useCancelTransferMutation,
} from '@/store/api/girviTransferApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  ITransferOutForm,
  ITransferReturnForm,
} from '@/types/girviTransfer.types'

export const useGirviTransferActions = (
  shopId:     string,
  girviId:    string,
  transferId?: string
) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [transferOutMutation,  transferOutState]  = useTransferOutMutation()
  const [transferReturnMutation, returnState]     = useTransferReturnMutation()
  const [cancelMutation,       cancelState]       = useCancelTransferMutation()

  // ── Transfer Out ────────────────────────────────────────────────────────────
  const transferOut = useCallback(
    async (
      data:      ITransferOutForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await transferOutMutation({
          shopId,
          girviId,
          ...data,
        }).unwrap()
        showSuccess('Girvi transferred successfully', 'Transferred')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [transferOutMutation, shopId, girviId, handleError, showSuccess]
  )

  // ── Transfer Return ─────────────────────────────────────────────────────────
  const transferReturn = useCallback(
    async (
      data:      ITransferReturnForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      if (!transferId) return { success: false }
      try {
        const result = await transferReturnMutation({
          shopId,
          girviId,
          transferId,
          ...data,
        }).unwrap()
        showSuccess('Transfer returned successfully', 'Returned')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [transferReturnMutation, shopId, girviId, transferId, handleError, showSuccess]
  )

  // ── Cancel Transfer ─────────────────────────────────────────────────────────
  const cancelTransfer = useCallback(
    async () => {
      if (!transferId) return { success: false }
      try {
        const result = await cancelMutation({
          shopId,
          girviId,
          transferId,
        }).unwrap()
        showSuccess('Transfer cancelled successfully', 'Cancelled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [cancelMutation, shopId, girviId, transferId, handleError, showSuccess]
  )

  return {
    // Actions
    transferOut,
    transferReturn,
    cancelTransfer,

    // Loading states
    isTransferringOut: transferOutState.isLoading,
    isReturning:       returnState.isLoading,
    isCancelling:      cancelState.isLoading,
  }
}