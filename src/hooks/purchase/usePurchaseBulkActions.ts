// FILE: src/hooks/purchase/usePurchaseBulkActions.ts
// Hook for bulk purchase operations (delete, approve)

import { useCallback } from 'react'
import {
  useBulkDeletePurchasesMutation,
  useBulkApprovePurchasesMutation,
} from '@/store/api/purchaseApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'

/**
 * Custom hook for bulk purchase operations
 * Handles bulk delete and bulk approve actions
 */
export const usePurchaseBulkActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

 
  // 🔧 MUTATIONS
 
  const [bulkDeleteMutation, bulkDeleteState] = useBulkDeletePurchasesMutation()
  const [bulkApproveMutation, bulkApproveState] =
    useBulkApprovePurchasesMutation()

 
  // 🗑️ BULK DELETE PURCHASES
 
  const bulkDeletePurchases = useCallback(
    async (purchaseIds: string[]) => {
      try {
        const result = await bulkDeleteMutation({
          shopId,
          purchaseIds,
        }).unwrap()
        showSuccess(
          `${result.deletedCount} purchases deleted successfully!`,
          'Bulk Delete'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to delete purchases',
        }
      }
    },
    [bulkDeleteMutation, shopId, handleError, showSuccess]
  )

 
  // ✅ BULK APPROVE PURCHASES
 
  const bulkApprovePurchases = useCallback(
    async (purchaseIds: string[]) => {
      try {
        const result = await bulkApproveMutation({
          shopId,
          purchaseIds,
        }).unwrap()
        showSuccess(
          `${result.approvedCount} purchases approved successfully!`,
          'Bulk Approve'
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to approve purchases',
        }
      }
    },
    [bulkApproveMutation, shopId, handleError, showSuccess]
  )

 
  // 📤 RETURN API
 
  return {
    // Loading states
    isBulkDeleting: bulkDeleteState.isLoading,
    isBulkApproving: bulkApproveState.isLoading,

    // Actions
    bulkDeletePurchases,
    bulkApprovePurchases,

    // States
    bulkDeleteState,
    bulkApproveState,
  }
}

export default usePurchaseBulkActions