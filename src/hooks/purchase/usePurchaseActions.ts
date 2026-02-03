// FILE: src/hooks/purchase/usePurchaseActions.ts
// Hook for individual purchase actions (CRUD + workflow operations)

import { useCallback } from 'react'
import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
  useUpdatePurchaseStatusMutation,
  useReceivePurchaseMutation,
  useCancelPurchaseMutation,
  useApprovePurchaseMutation,
  useRejectPurchaseMutation,
  useAddPaymentMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  ICreatePurchaseForm,
  IUpdatePurchaseForm,
  IReceivePurchaseForm,
  IAddPaymentForm,
  PurchaseStatus,
} from '@/types/purchase.types'

/**
 * Custom hook for individual purchase actions
 * Handles CRUD operations and workflow actions (approve, reject, cancel, receive)
 */
export const usePurchaseActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

 
  // 🔧 MUTATIONS
 
  const [createMutation, createState] = useCreatePurchaseMutation()
  const [updateMutation, updateState] = useUpdatePurchaseMutation()
  const [deleteMutation, deleteState] = useDeletePurchaseMutation()
  const [updateStatusMutation, updateStatusState] =
    useUpdatePurchaseStatusMutation()
  const [receiveMutation, receiveState] = useReceivePurchaseMutation()
  const [cancelMutation, cancelState] = useCancelPurchaseMutation()
  const [approveMutation, approveState] = useApprovePurchaseMutation()
  const [rejectMutation, rejectState] = useRejectPurchaseMutation()
  const [addPaymentMutation, addPaymentState] = useAddPaymentMutation()

 
  // ➕ CREATE PURCHASE
 
  const createPurchase = useCallback(
    async (
      data: ICreatePurchaseForm,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()
        showSuccess('Purchase created successfully!', 'Purchase Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to create purchase',
        }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

 
  // ✏️ UPDATE PURCHASE
 
  const updatePurchase = useCallback(
    async (
      purchaseId: string,
      data: IUpdatePurchaseForm,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({
          shopId,
          purchaseId,
          ...data,
        }).unwrap()
        showSuccess('Purchase updated successfully!', 'Purchase Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to update purchase',
        }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

 
  // 🗑️ DELETE PURCHASE
 
  const deletePurchase = useCallback(
    async (purchaseId: string) => {
      try {
        await deleteMutation({ shopId, purchaseId }).unwrap()
        showSuccess('Purchase deleted successfully!', 'Purchase Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to delete purchase',
        }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

 
  // 🔄 UPDATE PURCHASE STATUS
 
  const updatePurchaseStatus = useCallback(
    async (purchaseId: string, status: PurchaseStatus) => {
      try {
        const result = await updateStatusMutation({
          shopId,
          purchaseId,
          status,
        }).unwrap()
        showSuccess(
          `Purchase status updated to ${status}`,
          'Status Updated'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to update status',
        }
      }
    },
    [updateStatusMutation, shopId, handleError, showSuccess]
  )

 
  // 📦 RECEIVE PURCHASE
 
  const receivePurchase = useCallback(
    async (purchaseId: string, data: IReceivePurchaseForm) => {
      try {
        const result = await receiveMutation({
          shopId,
          purchaseId,
          ...data,
        }).unwrap()
        showSuccess(
          'Purchase marked as received and inventory updated',
          'Purchase Received'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to receive purchase',
        }
      }
    },
    [receiveMutation, shopId, handleError, showSuccess]
  )

 
  // ❌ CANCEL PURCHASE
 
  const cancelPurchase = useCallback(
    async (purchaseId: string, reason: string) => {
      try {
        const result = await cancelMutation({
          shopId,
          purchaseId,
          reason,
        }).unwrap()
        showSuccess('Purchase cancelled successfully!', 'Purchase Cancelled')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to cancel purchase',
        }
      }
    },
    [cancelMutation, shopId, handleError, showSuccess]
  )

 
  // ✅ APPROVE PURCHASE
 
  const approvePurchase = useCallback(
    async (purchaseId: string, notes?: string) => {
      try {
        const result = await approveMutation({
          shopId,
          purchaseId,
          notes,
        }).unwrap()
        showSuccess('Purchase approved successfully!', 'Purchase Approved')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to approve purchase',
        }
      }
    },
    [approveMutation, shopId, handleError, showSuccess]
  )

 
  // ❌ REJECT PURCHASE
 
  const rejectPurchase = useCallback(
    async (purchaseId: string, reason: string) => {
      try {
        const result = await rejectMutation({
          shopId,
          purchaseId,
          reason,
        }).unwrap()
        showSuccess('Purchase rejected successfully!', 'Purchase Rejected')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to reject purchase',
        }
      }
    },
    [rejectMutation, shopId, handleError, showSuccess]
  )

 
  // 💰 ADD PAYMENT
 
  const addPayment = useCallback(
    async (
      purchaseId: string,
      data: IAddPaymentForm,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await addPaymentMutation({
          shopId,
          purchaseId,
          ...data,
        }).unwrap()
        showSuccess('Payment added successfully!', 'Payment Added')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to add payment',
        }
      }
    },
    [addPaymentMutation, shopId, handleError, showSuccess]
  )

 
  // 📤 RETURN API
 
  return {
    // Loading states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isUpdatingStatus: updateStatusState.isLoading,
    isReceiving: receiveState.isLoading,
    isCancelling: cancelState.isLoading,
    isApproving: approveState.isLoading,
    isRejecting: rejectState.isLoading,
    isAddingPayment: addPaymentState.isLoading,

    // Actions
    createPurchase,
    updatePurchase,
    deletePurchase,
    updatePurchaseStatus,
    receivePurchase,
    cancelPurchase,
    approvePurchase,
    rejectPurchase,
    addPayment,

    // States
    createState,
    updateState,
    deleteState,
    updateStatusState,
    receiveState,
    cancelState,
    approveState,
    rejectState,
    addPaymentState,
  }
}

export default usePurchaseActions