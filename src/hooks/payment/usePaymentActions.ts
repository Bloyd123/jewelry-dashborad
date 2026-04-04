// FILE: src/features/payment/hooks/usePaymentActions.ts

import { useCallback } from 'react'
import {
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useUpdatePaymentStatusMutation,
  useMarkPaymentAsCompletedMutation,
  useCancelPaymentMutation,
  useClearChequeMutation,
   useBounceChequeMutation,
  useReconcilePaymentMutation,
  useSendReceiptMutation,
  useRegenerateReceiptMutation,
  useBulkReconcilePaymentsMutation,
  useBulkExportPaymentsMutation,
  useBulkPrintReceiptsMutation,
  useApprovePaymentMutation,
  useRejectPaymentMutation,
  useProcessRefundMutation,

} from '@/store/api/paymentApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreatePaymentRequest,
  UpdatePaymentRequest,
  UpdatePaymentStatusRequest,
  ChequeClearanceRequest,
  ChequeBounceRequest,
  ReconcilePaymentRequest,
  SendReceiptRequest,
  BulkReconcileRequest,
  BulkExportRequest,
  ProcessRefundRequest,
  PaymentStatus,
  ExportFormat,
} from '@/types/payment.types'

export const usePaymentActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ── Mutations ────────────────────────────────────────────
  const [createMutation,          createState]         = useCreatePaymentMutation()
  const [updateMutation,          updateState]         = useUpdatePaymentMutation()
  const [deleteMutation,          deleteState]         = useDeletePaymentMutation()
  const [updateStatusMutation,    updateStatusState]   = useUpdatePaymentStatusMutation()
  const [markCompletedMutation,   markCompletedState]  = useMarkPaymentAsCompletedMutation()
  const [cancelMutation,          cancelState]         = useCancelPaymentMutation()
  const [clearChequeMutation,     clearChequeState]    = useClearChequeMutation()
  const [bounceChequeMutation, bounceChequeState] = useBounceChequeMutation()
  const [reconcileMutation,       reconcileState]      = useReconcilePaymentMutation()
  const [sendReceiptMutation,     sendReceiptState]    = useSendReceiptMutation()
  const [regenReceiptMutation,    regenReceiptState]   = useRegenerateReceiptMutation()
  const [bulkReconcileMutation,   bulkReconcileState]  = useBulkReconcilePaymentsMutation()
  const [bulkExportMutation,      bulkExportState]     = useBulkExportPaymentsMutation()
  const [bulkPrintMutation,       bulkPrintState]      = useBulkPrintReceiptsMutation()
  const [approveMutation,         approveState]        = useApprovePaymentMutation()
  const [rejectMutation,          rejectState]         = useRejectPaymentMutation()
  const [processRefundMutation,   processRefundState]  = useProcessRefundMutation()

  // ─────────────────────────────────────────────
  // CREATE PAYMENT
  // ─────────────────────────────────────────────
  const createPayment = useCallback(
    async (
      data: CreatePaymentRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('Payment recorded successfully', 'Payment Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // UPDATE PAYMENT
  // ─────────────────────────────────────────────
  const updatePayment = useCallback(
    async (
      paymentId: string,
      data: UpdatePaymentRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Payment updated successfully', 'Payment Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // DELETE PAYMENT
  // ─────────────────────────────────────────────
  const deletePayment = useCallback(
    async (paymentId: string) => {
      try {
        await deleteMutation({ shopId, paymentId }).unwrap()
        showSuccess('Payment deleted successfully', 'Payment Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // UPDATE STATUS
  // ─────────────────────────────────────────────
  const updatePaymentStatus = useCallback(
    async (paymentId: string, data: UpdatePaymentStatusRequest) => {
      try {
        const result = await updateStatusMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Payment status updated', 'Status Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [updateStatusMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // MARK AS COMPLETED
  // ─────────────────────────────────────────────
  const markAsCompleted = useCallback(
    async (paymentId: string) => {
      try {
        const result = await markCompletedMutation({ shopId, paymentId }).unwrap()
        showSuccess('Payment marked as completed', 'Payment Completed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [markCompletedMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // CANCEL PAYMENT
  // ─────────────────────────────────────────────
  const cancelPayment = useCallback(
    async (paymentId: string, reason: string) => {
      try {
        const result = await cancelMutation({ shopId, paymentId, reason }).unwrap()
        showSuccess('Payment cancelled successfully', 'Payment Cancelled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [cancelMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // CLEAR CHEQUE
  // ─────────────────────────────────────────────
  const clearCheque = useCallback(
    async (paymentId: string, data: ChequeClearanceRequest) => {
      try {
        const result = await clearChequeMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Cheque cleared successfully', 'Cheque Cleared')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [clearChequeMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // BOUNCE CHEQUE
  // ─────────────────────────────────────────────
  const bounceCheque = useCallback(
    async (paymentId: string, data: ChequeBounceRequest) => {
      try {
        const result = await bounceChequeMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Cheque marked as bounced', 'Cheque Bounced')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [bounceChequeMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // RECONCILE PAYMENT
  // ─────────────────────────────────────────────
  const reconcilePayment = useCallback(
    async (paymentId: string, data: ReconcilePaymentRequest) => {
      try {
        const result = await reconcileMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Payment reconciled successfully', 'Payment Reconciled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [reconcileMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // SEND RECEIPT
  // ─────────────────────────────────────────────
  const sendReceipt = useCallback(
    async (paymentId: string, data: SendReceiptRequest) => {
      try {
        await sendReceiptMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess(`Receipt sent via ${data.method}`, 'Receipt Sent')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [sendReceiptMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // REGENERATE RECEIPT
  // ─────────────────────────────────────────────
  const regenerateReceipt = useCallback(
    async (paymentId: string) => {
      try {
        const result = await regenReceiptMutation({ shopId, paymentId }).unwrap()
        showSuccess('Receipt regenerated successfully', 'Receipt Regenerated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [regenReceiptMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // BULK RECONCILE
  // ─────────────────────────────────────────────
// ✅ AFTER
const bulkReconcile = useCallback(
  async (data: BulkReconcileRequest) => {
    try {
      const result = await bulkReconcileMutation({ shopId, ...data }).unwrap()
    showSuccess(`${result.data.processedCount} payments reconciled`, 'Bulk Reconciled')
      return { success: true, data: result }
    } catch (error: any) {
      handleError(error)
      return { success: false, error: error.data?.message }
    }
  },
  [bulkReconcileMutation, shopId, handleError, showSuccess]
)

  // ─────────────────────────────────────────────
  // BULK EXPORT
  // ─────────────────────────────────────────────
  const bulkExport = useCallback(
    async (data: BulkExportRequest) => {
      try {
        const result = await bulkExportMutation({ shopId, ...data }).unwrap()
        showSuccess(`${result.count} payments exported as ${data.format}`, 'Export Ready')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [bulkExportMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // BULK PRINT RECEIPTS
  // ─────────────────────────────────────────────
  const bulkPrintReceipts = useCallback(
    async (paymentIds: string[]) => {
      try {
        const result = await bulkPrintMutation({ shopId, paymentIds }).unwrap()
        showSuccess(`${result.count} receipts ready to print`, 'Receipts Ready')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [bulkPrintMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // APPROVE PAYMENT
  // ─────────────────────────────────────────────
  const approvePayment = useCallback(
    async (paymentId: string, notes?: string) => {
      try {
        const result = await approveMutation({ shopId, paymentId, notes }).unwrap()
        showSuccess('Payment approved successfully', 'Payment Approved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [approveMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // REJECT PAYMENT
  // ─────────────────────────────────────────────
  const rejectPayment = useCallback(
    async (paymentId: string, reason: string) => {
      try {
        const result = await rejectMutation({ shopId, paymentId, reason }).unwrap()
        showSuccess('Payment rejected', 'Payment Rejected')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [rejectMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // PROCESS REFUND
  // ─────────────────────────────────────────────
  const processRefund = useCallback(
    async (
      paymentId: string,
      data: ProcessRefundRequest,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await processRefundMutation({ shopId, paymentId, ...data }).unwrap()
        showSuccess('Refund processed successfully', 'Refund Done')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [processRefundMutation, shopId, handleError, showSuccess]
  )

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────
  return {
    // Actions
    createPayment,
    updatePayment,
    deletePayment,
    updatePaymentStatus,
    markAsCompleted,
    cancelPayment,
    clearCheque,
    bounceCheque,
    reconcilePayment,
    sendReceipt,
    regenerateReceipt,
    bulkReconcile,
    bulkExport,
    bulkPrintReceipts,
    approvePayment,
    rejectPayment,
    processRefund,

    // Loading states (use these to disable buttons / show spinners)
    isCreating:          createState.isLoading,
    isUpdating:          updateState.isLoading,
    isDeleting:          deleteState.isLoading,
    isUpdatingStatus:    updateStatusState.isLoading,
    isMarkingCompleted:  markCompletedState.isLoading,
    isCancelling:        cancelState.isLoading,
    isClearingCheque:    clearChequeState.isLoading,
    isBouncingCheque:    bounceChequeState.isLoading,
    isReconciling:       reconcileState.isLoading,
    isSendingReceipt:    sendReceiptState.isLoading,
    isRegeneratingReceipt: regenReceiptState.isLoading,
    isBulkReconciling:   bulkReconcileState.isLoading,
    isBulkExporting:     bulkExportState.isLoading,
    isBulkPrinting:      bulkPrintState.isLoading,
    isApproving:         approveState.isLoading,
    isRejecting:         rejectState.isLoading,
    isProcessingRefund:  processRefundState.isLoading,

    // Any mutation loading (useful for global spinner)
    isMutating:
      createState.isLoading     ||
      updateState.isLoading     ||
      deleteState.isLoading     ||
      updateStatusState.isLoading ||
      cancelState.isLoading     ||
      clearChequeState.isLoading ||
      bounceChequeState.isLoading ||
      reconcileState.isLoading  ||
     approveState.isLoading  ||
rejectState.isLoading   ||
      processRefundState.isLoading,
  }
}