// FILE: src/features/product/hooks/useProductBulkActions.ts

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useBulkDeleteProductsMutation,
  useBulkUpdateStatusMutation,
} from '@/store/api/productApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  BulkDeleteData,
  BulkUpdateStatusData,
} from '@/types/product.types'

/**
 *  PRODUCT BULK ACTIONS HOOK
 * Handles bulk operations on multiple products
 */
export const useProductBulkActions = (shopId: string) => {
  const { t } = useTranslation()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  
  // 🔧 MUTATIONS
  
  const [bulkDeleteMutation, bulkDeleteState] = useBulkDeleteProductsMutation()
  const [bulkUpdateStatusMutation, bulkUpdateStatusState] =
    useBulkUpdateStatusMutation()

  
  // 🗑 BULK DELETE
  
  const bulkDeleteProducts = useCallback(
    async (data: Omit<BulkDeleteData, 'shopId'>) => {
      try {
        const result = await bulkDeleteMutation({ shopId, ...data }).unwrap()
        showSuccess(
          t('product.messages.bulkDeleteSuccess', {
            count: result.deletedCount,
          }),
          t('product.messages.bulkDeleted')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.bulkDeleteFailed'),
        }
      }
    },
    [bulkDeleteMutation, shopId, handleError, showSuccess, t]
  )

  
  //  BULK UPDATE STATUS
  
  const bulkUpdateStatus = useCallback(
    async (data: Omit<BulkUpdateStatusData, 'shopId'>) => {
      try {
        const result = await bulkUpdateStatusMutation({
          shopId,
          ...data,
        }).unwrap()
        showSuccess(
          t('product.messages.bulkUpdateSuccess', {
            count: result.modifiedCount,
          }),
          t('product.messages.bulkUpdated')
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || t('product.errors.bulkUpdateFailed'),
        }
      }
    },
    [bulkUpdateStatusMutation, shopId, handleError, showSuccess, t]
  )

  
  //  RETURN API
  
  return {
    // Actions
    bulkDeleteProducts,
    bulkUpdateStatus,

    // Loading states
    isBulkDeleting: bulkDeleteState.isLoading,
    isBulkUpdating: bulkUpdateStatusState.isLoading,

    // States (for advanced usage)
    bulkDeleteState,
    bulkUpdateStatusState,
  }
}