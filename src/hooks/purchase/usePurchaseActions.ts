// FILE: src/hooks/purchase/usePurchaseActions.ts

import { useCallback } from 'react'
import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  useReturnPurchaseMutation,
  useApprovePurchaseMutation,
  useRejectPurchaseMutation,
  useAddPaymentMutation,
  useUploadDocumentMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  ICreatePurchaseForm,
  IUpdatePurchaseForm,
  IReceivePurchaseForm,
  IAddPaymentForm,
} from '@/types/purchase.types'

export const usePurchaseActions = (shopId: string, purchaseId?: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation,     createState]     = useCreatePurchaseMutation()
  const [updateMutation,     updateState]     = useUpdatePurchaseMutation()
  const [deleteMutation,     deleteState]     = useDeletePurchaseMutation()
  const [statusMutation,     statusState]     = useUpdatePurchaseStatusMutation()
  const [receiveMutation,    receiveState]    = useReceivePurchaseMutation()
  const [cancelMutation,     cancelState]     = useCancelPurchaseMutation()
  const [returnMutation,     returnState]     = useReturnPurchaseMutation()
  const [approveMutation,    approveState]    = useApprovePurchaseMutation()
  const [rejectMutation,     rejectState]     = useRejectPurchaseMutation()
  const [addPaymentMutation, addPaymentState] = useAddPaymentMutation()
  const [uploadDocMutation,  uploadDocState]  = useUploadDocumentMutation()

  // ── Create ──
  const createPurchase = useCallback(
    async (
      data: ICreatePurchaseForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('Purchase created successfully', 'Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // ── Update ──
  const updatePurchase = useCallback(
    async (
      data: IUpdatePurchaseForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      if (!purchaseId) return { success: false }
      try {
        await updateMutation({ shopId, purchaseId, ...data }).unwrap()
        showSuccess('Purchase updated successfully', 'Updated')
        return { success: true }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [updateMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Delete ──
  const deletePurchase = useCallback(
    async (id?: string) => {
      const pid = id ?? purchaseId
      if (!pid) return { success: false }
      try {
        await deleteMutation({ shopId, purchaseId: pid }).unwrap()
        showSuccess('Purchase deleted successfully', 'Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [deleteMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Update Status ──
  const updateStatus = useCallback(
    async (status: string) => {
      if (!purchaseId) return { success: false }
      try {
        await statusMutation({ shopId, purchaseId, status }).unwrap()
        showSuccess(`Status updated to ${status}`, 'Status Updated')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [statusMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Receive ──
  const receivePurchase = useCallback(
    async (data: IReceivePurchaseForm) => {
      if (!purchaseId) return { success: false }
      try {
        await receiveMutation({ shopId, purchaseId, data }).unwrap()
        showSuccess('Purchase received. Inventory updated!', 'Received')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [receiveMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Cancel ──
  const cancelPurchase = useCallback(
    async (reason: string) => {
      if (!purchaseId) return { success: false }
      try {
        await cancelMutation({ shopId, purchaseId, reason }).unwrap()
        showSuccess('Purchase cancelled successfully', 'Cancelled')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [cancelMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Return ──
  const returnPurchase = useCallback(
    async (reason: string) => {
      if (!purchaseId) return { success: false }
      try {
        await returnMutation({ shopId, purchaseId, reason }).unwrap()
        showSuccess('Purchase returned successfully', 'Returned')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [returnMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Approve ──
  const approvePurchase = useCallback(
    async (notes?: string) => {
      if (!purchaseId) return { success: false }
      try {
        await approveMutation({ shopId, purchaseId, notes }).unwrap()
        showSuccess('Purchase approved successfully', 'Approved')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [approveMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Reject ──
  const rejectPurchase = useCallback(
    async (reason: string) => {
      if (!purchaseId) return { success: false }
      try {
        await rejectMutation({ shopId, purchaseId, reason }).unwrap()
        showSuccess('Purchase rejected', 'Rejected')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [rejectMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Add Payment ──
  const addPayment = useCallback(
    async (
      data: IAddPaymentForm,
      setErrors?: (e: Record<string, string>) => void
    ) => {
      if (!purchaseId) return { success: false }
      try {
        await addPaymentMutation({ shopId, purchaseId, data }).unwrap()
        showSuccess('Payment added successfully', 'Payment Added')
        return { success: true }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false }
      }
    },
    [addPaymentMutation, shopId, purchaseId, handleError, showSuccess]
  )

  // ── Upload Document ──
  const uploadDocument = useCallback(
    async (documentType: string, documentUrl: string, documentNumber?: string) => {
      if (!purchaseId) return { success: false }
      try {
        await uploadDocMutation({ shopId, purchaseId, documentType, documentUrl, documentNumber }).unwrap()
        showSuccess('Document uploaded successfully', 'Uploaded')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [uploadDocMutation, shopId, purchaseId, handleError, showSuccess]
  )

  return {
    // Actions
    createPurchase,
    updatePurchase,
    deletePurchase,
    updateStatus,
    receivePurchase,
    cancelPurchase,
    returnPurchase,
    approvePurchase,
    rejectPurchase,
    addPayment,
    uploadDocument,

    // Loading states
    isCreating:       createState.isLoading,
    isUpdating:       updateState.isLoading,
    isDeleting:       deleteState.isLoading,
    isUpdatingStatus: statusState.isLoading,
    isReceiving:      receiveState.isLoading,
    isCancelling:     cancelState.isLoading,
    isReturning:      returnState.isLoading,
    isApproving:      approveState.isLoading,
    isRejecting:      rejectState.isLoading,
    isAddingPayment:  addPaymentState.isLoading,
    isUploadingDoc:   uploadDocState.isLoading,
  }
}