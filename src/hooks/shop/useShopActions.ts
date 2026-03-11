//
// FILE: src/features/shops/hooks/useShopActions.ts
//

import { useCallback } from 'react'
import {
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useToggleShopStatusMutation,
  useBulkActivateShopsMutation,
  useBulkDeactivateShopsMutation,
  useBulkDeleteShopsMutation,
} from '@/store/api/ShopApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { ShopFormData } from '@/types/shop.types'

export const useShopActions = () => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  const [createMutation,        createState]          = useCreateShopMutation()
  const [updateMutation,        updateState]          = useUpdateShopMutation()
  const [deleteMutation,        deleteState]          = useDeleteShopMutation()
  const [toggleStatusMutation,  toggleStatusState]    = useToggleShopStatusMutation()
  const [bulkActivateMutation,  bulkActivateState]    = useBulkActivateShopsMutation()
  const [bulkDeactivateMutation,bulkDeactivateState]  = useBulkDeactivateShopsMutation()
  const [bulkDeleteMutation,    bulkDeleteState]      = useBulkDeleteShopsMutation()

  // CREATE
  const createShop = useCallback(
    async (
      data: ShopFormData,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation(data).unwrap()
        showSuccess('Shop created successfully!', 'Shop Created')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [createMutation, handleError, showSuccess]
  )

  // UPDATE
  const updateShop = useCallback(
    async (
      shopId: string,
      data: Partial<ShopFormData>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, data }).unwrap()
        showSuccess('Shop updated successfully!', 'Shop Updated')
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return { success: false, error: error.data?.message }
      }
    },
    [updateMutation, handleError, showSuccess]
  )

  // DELETE
  const deleteShop = useCallback(
    async (shopId: string) => {
      try {
        await deleteMutation(shopId).unwrap()
        showSuccess('Shop deleted successfully!', 'Shop Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [deleteMutation, handleError, showSuccess]
  )

  // TOGGLE STATUS
  const toggleShopStatus = useCallback(
    async (shopId: string, isActive: boolean) => {
      try {
        const result = await toggleStatusMutation({ shopId, isActive }).unwrap()
        showSuccess(
          `Shop ${isActive ? 'activated' : 'deactivated'} successfully!`,
          `Shop ${isActive ? 'Activated' : 'Deactivated'}`
        )
        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return { success: false, error: error.data?.message }
      }
    },
    [toggleStatusMutation, handleError, showSuccess]
  )

  // BULK ACTIVATE
  const bulkActivate = useCallback(
    async (shopIds: string[]) => {
      try {
        await bulkActivateMutation(shopIds).unwrap()
        showSuccess(`${shopIds.length} shops activated!`, 'Bulk Activated')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [bulkActivateMutation, handleError, showSuccess]
  )

  // BULK DEACTIVATE
  const bulkDeactivate = useCallback(
    async (shopIds: string[]) => {
      try {
        await bulkDeactivateMutation(shopIds).unwrap()
        showSuccess(`${shopIds.length} shops deactivated!`, 'Bulk Deactivated')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [bulkDeactivateMutation, handleError, showSuccess]
  )

  // BULK DELETE
  const bulkDelete = useCallback(
    async (shopIds: string[]) => {
      try {
        await bulkDeleteMutation(shopIds).unwrap()
        showSuccess(`${shopIds.length} shops deleted!`, 'Bulk Deleted')
        return { success: true }
      } catch (error: any) {
        handleError(error)
        return { success: false }
      }
    },
    [bulkDeleteMutation, handleError, showSuccess]
  )

  return {
    // Actions
    createShop,
    updateShop,
    deleteShop,
    toggleShopStatus,
    bulkActivate,
    bulkDeactivate,
    bulkDelete,

    // Loading states
    isCreating:          createState.isLoading,
    isUpdating:          updateState.isLoading,
    isDeleting:          deleteState.isLoading,
    isTogglingStatus:    toggleStatusState.isLoading,
    isBulkActivating:    bulkActivateState.isLoading,
    isBulkDeactivating:  bulkDeactivateState.isLoading,
    isBulkDeleting:      bulkDeleteState.isLoading,
  }
}