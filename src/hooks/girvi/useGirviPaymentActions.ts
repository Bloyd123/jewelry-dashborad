// FILE: src/features/girvi/hooks/useGirviPaymentActions.ts
import { useCallback } from 'react'
import {
  useAddGirviPaymentMutation,
  useDeleteGirviPaymentMutation,
} from '@/store/api/girviPaymentApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { AddGirviPaymentRequest } from '@/types/girvi.types'

export const useGirviPaymentActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [addMutation,    addState]    = useAddGirviPaymentMutation()
  const [deleteMutation, deleteState] = useDeleteGirviPaymentMutation()

  // POST /shops/:shopId/girvi/:girviId/payments
  const addPayment = useCallback(
    async (
      girviId: string,
      data: AddGirviPaymentRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await addMutation({ shopId, girviId, ...data }).unwrap()

        const net = result.payment.netAmountReceived
        showSuccess(
          `Payment recorded. ₹${net.toLocaleString('en-IN')} received`,
          'Payment Added'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [addMutation, shopId, handleError, showSuccess]
  )

  // DELETE /shops/:shopId/girvi/:girviId/payments/:paymentId
  const deletePayment = useCallback(
    async (girviId: string, paymentId: string) => {
      try {
        const result = await deleteMutation({ shopId, girviId, paymentId }).unwrap()
        showSuccess(
          `Payment ${result.receiptNumber} deleted and balance reversed`,
          'Payment Deleted'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  return {
    addPayment,
    deletePayment,

    isAdding:   addState.isLoading,
    isDeleting: deleteState.isLoading,
    isMutating: addState.isLoading || deleteState.isLoading,
  }
}