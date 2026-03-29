// FILE: src/features/sales/hooks/useSalePayments.ts

import { useCallback } from 'react'
import {
  useGetSalePaymentsQuery,
  useAddPaymentMutation,
  useGenerateReceiptQuery,
  useSendPaymentReminderMutation,
} from '@/store/api/salesApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { AddPaymentRequest } from '@/types/sale.types'

export const useSalePayments = (shopId: string, saleId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ─── Payments List ────────────────────────
  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetSalePaymentsQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Receipt ─────────────────────────────
  const {
    data: receipt,
    isLoading: isReceiptLoading,
  } = useGenerateReceiptQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Mutations ────────────────────────────
  const [addPaymentMutation,   addPaymentState]   = useAddPaymentMutation()
  const [sendReminderMutation, sendReminderState] = useSendPaymentReminderMutation()

  // ─── ADD PAYMENT ──────────────────────────
  const addPayment = useCallback(
    async (
      data: AddPaymentRequest,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await addPaymentMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess('Payment recorded successfully', 'Payment Added')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [addPaymentMutation, shopId, saleId, handleError, showSuccess]
  )

  // ─── SEND REMINDER ────────────────────────
  const sendReminder = useCallback(async () => {
    try {
      await sendReminderMutation({ shopId, saleId }).unwrap()
      showSuccess('Payment reminder sent to customer', 'Reminder Sent')
      return { success: true }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }, [sendReminderMutation, shopId, saleId, handleError, showSuccess])

  return {
    // ── Data ──────────────────────────────
    payments: payments || [],
    receipt:  receipt  || null,

    // ── Loading States ────────────────────
    isPaymentsLoading,
    isReceiptLoading,
    isAddingPayment:  addPaymentState.isLoading,
    isSendingReminder: sendReminderState.isLoading,

    // ── Actions ───────────────────────────
    addPayment,
    sendReminder,
    refetchPayments,
  }
}