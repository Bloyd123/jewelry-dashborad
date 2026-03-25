// FILE: src/hooks/purchase/usePurchasePayments.ts

import { useCallback } from 'react'
import {
  useGetPurchasePaymentsQuery,
  useAddPaymentMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { IAddPaymentForm } from '@/types/purchase.types'

export const usePurchasePayments = (shopId: string, purchaseId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ── GET Payments ──
  const {
    data: payments,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPurchasePaymentsQuery(
    { shopId, purchaseId },
    { skip: !shopId || !purchaseId }
  )

  // ── ADD Payment ──
  const [addPaymentMutation, addPaymentState] = useAddPaymentMutation()

  const addPayment = useCallback(
    async (
      data: IAddPaymentForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await addPaymentMutation({ shopId, purchaseId, data }).unwrap()
        showSuccess('Payment added successfully', 'Payment Added')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [addPaymentMutation, shopId, purchaseId, handleError, showSuccess]
  )

  return {
    // Data
    payments:       payments ?? [],
    isLoading:      isLoading || isFetching,
    isAddingPayment: addPaymentState.isLoading,
    error,

    // Actions
    addPayment,
    refetch,
  }
}