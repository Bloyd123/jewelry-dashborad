// FILE: src/features/sales/hooks/useSaleActions.ts

import { useCallback } from 'react'
import {
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useUpdateSaleStatusMutation,
  useConfirmSaleMutation,
  useDeliverSaleMutation,
  useCompleteSaleMutation,
  useCancelSaleMutation,
  useReturnSaleMutation,
  useAddOldGoldMutation,
  useRemoveOldGoldMutation,
  useApplyDiscountMutation,
  useRemoveDiscountMutation,
  useApproveSaleMutation,
  useRejectSaleMutation,
  useSendInvoiceMutation,
  usePrintInvoiceMutation,
  useSendPaymentReminderMutation,
  useUploadDocumentMutation,
} from '@/store/api/salesApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateSaleRequest,
  UpdateSaleRequest,
  ReturnSaleRequest,
  ApplyDiscountRequest,
  SendInvoiceRequest,
  OldGoldItem,
  SaleStatus,
  DocumentType,
} from '@/types/sale.types'

export const useSaleActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ─── Mutations ────────────────────────────
  const [createMutation,          createState]          = useCreateSaleMutation()
  const [updateMutation,          updateState]          = useUpdateSaleMutation()
  const [deleteMutation,          deleteState]          = useDeleteSaleMutation()
  const [updateStatusMutation,    updateStatusState]    = useUpdateSaleStatusMutation()
  const [confirmMutation,         confirmState]         = useConfirmSaleMutation()
  const [deliverMutation,         deliverState]         = useDeliverSaleMutation()
  const [completeMutation,        completeState]        = useCompleteSaleMutation()
  const [cancelMutation,          cancelState]          = useCancelSaleMutation()
  const [returnMutation,          returnState]          = useReturnSaleMutation()
  const [addOldGoldMutation,      addOldGoldState]      = useAddOldGoldMutation()
  const [removeOldGoldMutation,   removeOldGoldState]   = useRemoveOldGoldMutation()
  const [applyDiscountMutation,   applyDiscountState]   = useApplyDiscountMutation()
  const [removeDiscountMutation,  removeDiscountState]  = useRemoveDiscountMutation()
  const [approveMutation,         approveState]         = useApproveSaleMutation()
  const [rejectMutation,          rejectState]          = useRejectSaleMutation()
  const [sendInvoiceMutation,     sendInvoiceState]     = useSendInvoiceMutation()
  const [printInvoiceMutation,    printInvoiceState]    = usePrintInvoiceMutation()
  const [sendReminderMutation,    sendReminderState]    = useSendPaymentReminderMutation()
  const [uploadDocumentMutation,  uploadDocumentState]  = useUploadDocumentMutation()

  // ─── CREATE ───────────────────────────────
  const createSale = useCallback(
    async (
      data: CreateSaleRequest,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('Sale created successfully', 'Sale Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // ─── UPDATE ───────────────────────────────
  const updateSale = useCallback(
    async (
      saleId: string,
      data: UpdateSaleRequest,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess('Sale updated successfully', 'Sale Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  // ─── DELETE ───────────────────────────────
  const deleteSale = useCallback(
    async (saleId: string, reason?: string) => {
      try {
        await deleteMutation({ shopId, saleId, reason }).unwrap()
        showSuccess('Sale deleted successfully', 'Sale Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // ─── UPDATE STATUS ────────────────────────
  const updateStatus = useCallback(
    async (saleId: string, status: SaleStatus) => {
      try {
        const result = await updateStatusMutation({ shopId, saleId, status }).unwrap()
        showSuccess(`Sale status updated to ${status}`, 'Status Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [updateStatusMutation, shopId, handleError, showSuccess]
  )

  // ─── CONFIRM ─────────────────────────────
  const confirmSale = useCallback(
    async (saleId: string, notes?: string) => {
      try {
        const result = await confirmMutation({ shopId, saleId, notes }).unwrap()
        showSuccess('Sale confirmed successfully', 'Sale Confirmed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [confirmMutation, shopId, handleError, showSuccess]
  )

  // ─── DELIVER ─────────────────────────────
  const deliverSale = useCallback(
    async (
      saleId: string,
      deliveryData: { deliveryType: string; deliveryAddress?: string; receivedBy?: string }
    ) => {
      try {
        const result = await deliverMutation({ shopId, saleId, ...deliveryData }).unwrap()
        showSuccess('Sale marked as delivered', 'Delivered')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [deliverMutation, shopId, handleError, showSuccess]
  )

  // ─── COMPLETE ────────────────────────────
  const completeSale = useCallback(
    async (saleId: string) => {
      try {
        const result = await completeMutation({ shopId, saleId }).unwrap()
        showSuccess('Sale completed successfully', 'Sale Completed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [completeMutation, shopId, handleError, showSuccess]
  )

  // ─── CANCEL ──────────────────────────────
  const cancelSale = useCallback(
    async (saleId: string, reason: string, refundAmount?: number) => {
      try {
        const result = await cancelMutation({ shopId, saleId, reason, refundAmount }).unwrap()
        showSuccess('Sale cancelled successfully', 'Sale Cancelled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [cancelMutation, shopId, handleError, showSuccess]
  )

  // ─── RETURN ──────────────────────────────
  const returnSale = useCallback(
    async (
      saleId: string,
      data: ReturnSaleRequest,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await returnMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess('Return processed successfully', 'Return Processed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [returnMutation, shopId, handleError, showSuccess]
  )

  // ─── OLD GOLD ────────────────────────────
  const addOldGold = useCallback(
    async (saleId: string, oldGoldItems: OldGoldItem[], totalOldGoldValue: number) => {
      try {
        const result = await addOldGoldMutation({ shopId, saleId, oldGoldItems, totalOldGoldValue }).unwrap()
        showSuccess('Old gold details added', 'Old Gold Added')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [addOldGoldMutation, shopId, handleError, showSuccess]
  )

  const removeOldGold = useCallback(
    async (saleId: string) => {
      try {
        const result = await removeOldGoldMutation({ shopId, saleId }).unwrap()
        showSuccess('Old gold details removed', 'Old Gold Removed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [removeOldGoldMutation, shopId, handleError, showSuccess]
  )

  // ─── DISCOUNT ────────────────────────────
  const applyDiscount = useCallback(
    async (saleId: string, data: ApplyDiscountRequest) => {
      try {
        const result = await applyDiscountMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess('Discount applied successfully', 'Discount Applied')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [applyDiscountMutation, shopId, handleError, showSuccess]
  )

  const removeDiscount = useCallback(
    async (saleId: string) => {
      try {
        const result = await removeDiscountMutation({ shopId, saleId }).unwrap()
        showSuccess('Discount removed successfully', 'Discount Removed')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [removeDiscountMutation, shopId, handleError, showSuccess]
  )

  // ─── APPROVAL ────────────────────────────
  const approveSale = useCallback(
    async (saleId: string, notes?: string) => {
      try {
        const result = await approveMutation({ shopId, saleId, notes }).unwrap()
        showSuccess('Sale approved successfully', 'Sale Approved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [approveMutation, shopId, handleError, showSuccess]
  )

  const rejectSale = useCallback(
    async (saleId: string, reason: string) => {
      try {
        const result = await rejectMutation({ shopId, saleId, reason }).unwrap()
        showSuccess('Sale rejected', 'Sale Rejected')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [rejectMutation, shopId, handleError, showSuccess]
  )

  // ─── INVOICE ─────────────────────────────
  const sendInvoice = useCallback(
    async (saleId: string, data: SendInvoiceRequest) => {
      try {
        await sendInvoiceMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess(`Invoice sent via ${data.method}`, 'Invoice Sent')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [sendInvoiceMutation, shopId, handleError, showSuccess]
  )

  const printInvoice = useCallback(
    async (saleId: string, printerType?: 'thermal_80mm' | 'thermal_58mm' | 'A4' | 'A5') => {
      try {
        const result = await printInvoiceMutation({ shopId, saleId, printerType }).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [printInvoiceMutation, shopId, handleError]
  )

  // ─── REMINDER ────────────────────────────
  const sendPaymentReminder = useCallback(
    async (saleId: string) => {
      try {
        await sendReminderMutation({ shopId, saleId }).unwrap()
        showSuccess('Payment reminder sent', 'Reminder Sent')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [sendReminderMutation, shopId, handleError, showSuccess]
  )

  // ─── UPLOAD DOCUMENT ─────────────────────
  const uploadDocument = useCallback(
    async (
      saleId: string,
      data: { documentType: DocumentType; documentUrl: string; documentNumber?: string }
    ) => {
      try {
        const result = await uploadDocumentMutation({ shopId, saleId, ...data }).unwrap()
        showSuccess('Document uploaded successfully', 'Document Uploaded')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [uploadDocumentMutation, shopId, handleError, showSuccess]
  )

  return {
    // ── Actions ───────────────────────────
    createSale,
    updateSale,
    deleteSale,
    updateStatus,
    confirmSale,
    deliverSale,
    completeSale,
    cancelSale,
    returnSale,
    addOldGold,
    removeOldGold,
    applyDiscount,
    removeDiscount,
    approveSale,
    rejectSale,
    sendInvoice,
    printInvoice,
    sendPaymentReminder,
    uploadDocument,

    // ── Loading States ────────────────────
    isCreating:          createState.isLoading,
    isUpdating:          updateState.isLoading,
    isDeleting:          deleteState.isLoading,
    isUpdatingStatus:    updateStatusState.isLoading,
    isConfirming:        confirmState.isLoading,
    isDelivering:        deliverState.isLoading,
    isCompleting:        completeState.isLoading,
    isCancelling:        cancelState.isLoading,
    isReturning:         returnState.isLoading,
    isAddingOldGold:     addOldGoldState.isLoading,
    isRemovingOldGold:   removeOldGoldState.isLoading,
    isApplyingDiscount:  applyDiscountState.isLoading,
    isRemovingDiscount:  removeDiscountState.isLoading,
    isApproving:         approveState.isLoading,
    isRejecting:         rejectState.isLoading,
    isSendingInvoice:    sendInvoiceState.isLoading,
    isPrinting:          printInvoiceState.isLoading,
    isSendingReminder:   sendReminderState.isLoading,
    isUploadingDocument: uploadDocumentState.isLoading,
  }
}