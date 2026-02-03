// FILE: src/features/supplier/hooks/useSupplierActions.ts

import { useCallback } from 'react'
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useRestoreSupplierMutation,
  useUpdateSupplierRatingMutation,
  useBlacklistSupplierMutation,
  useRemoveSupplierBlacklistMutation,
  useMarkSupplierAsPreferredMutation,
  useRemoveSupplierPreferredMutation,
  useUpdateSupplierBalanceMutation,
} from '@/store/api/supplierApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateSupplierDto,
  UpdateSupplierDto,
  UpdateRatingDto,
  UpdateBalanceDto,
} from '@/types/supplier.types'

/**
 *  SUPPLIER ACTIONS HOOK
 * Handles all supplier mutation operations with error handling and notifications
 */
export const useSupplierActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess, showWarning } = useNotification()

  //  MUTATIONS

  const [createMutation, createState] = useCreateSupplierMutation()
  const [updateMutation, updateState] = useUpdateSupplierMutation()
  const [deleteMutation, deleteState] = useDeleteSupplierMutation()
  const [restoreMutation, restoreState] = useRestoreSupplierMutation()
  const [updateRatingMutation, updateRatingState] =
    useUpdateSupplierRatingMutation()
  const [blacklistMutation, blacklistState] = useBlacklistSupplierMutation()
  const [removeBlacklistMutation, removeBlacklistState] =
    useRemoveSupplierBlacklistMutation()
  const [markPreferredMutation, markPreferredState] =
    useMarkSupplierAsPreferredMutation()
  const [removePreferredMutation, removePreferredState] =
    useRemoveSupplierPreferredMutation()
  const [updateBalanceMutation, updateBalanceState] =
    useUpdateSupplierBalanceMutation()

  //  CREATE SUPPLIER

  const createSupplier = useCallback(
    async (
      data: Omit<CreateSupplierDto, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()

        showSuccess(
          `Supplier "${result.businessName}" created successfully!`,
          'Supplier Created'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to create supplier',
        }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  //  UPDATE SUPPLIER

  const updateSupplier = useCallback(
    async (
      id: string,
      data: Omit<UpdateSupplierDto, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({ shopId, id, ...data }).unwrap()

        showSuccess(
          `Supplier "${result.businessName}" updated successfully!`,
          'Supplier Updated'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to update supplier',
        }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  //  DELETE SUPPLIER

  const deleteSupplier = useCallback(
    async (id: string, businessName?: string) => {
      try {
        await deleteMutation({ shopId, id }).unwrap()

        showWarning(
          businessName
            ? `Supplier "${businessName}" deleted successfully!`
            : 'Supplier deleted successfully!',
          'Supplier Deleted'
        )

        return { success: true }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to delete supplier',
        }
      }
    },
    [deleteMutation, shopId, handleError, showWarning]
  )

  //  RESTORE SUPPLIER

  const restoreSupplier = useCallback(
    async (id: string) => {
      try {
        const result = await restoreMutation({ shopId, id }).unwrap()

        showSuccess(
          `Supplier "${result.businessName}" restored successfully!`,
          'Supplier Restored'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to restore supplier',
        }
      }
    },
    [restoreMutation, shopId, handleError, showSuccess]
  )

  //  UPDATE RATING

  const updateRating = useCallback(
    async (id: string, ratings: UpdateRatingDto) => {
      try {
        const result = await updateRatingMutation({
          shopId,
          id,
          ...ratings,
        }).unwrap()

        showSuccess(
          `Rating updated for "${result.businessName}"`,
          'Rating Updated'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to update rating',
        }
      }
    },
    [updateRatingMutation, shopId, handleError, showSuccess]
  )

  //  BLACKLIST SUPPLIER

  const blacklistSupplier = useCallback(
    async (id: string, reason: string, businessName?: string) => {
      try {
        const result = await blacklistMutation({ shopId, id, reason }).unwrap()

        showWarning(
          businessName
            ? `Supplier "${businessName}" has been blacklisted`
            : 'Supplier has been blacklisted',
          'Supplier Blacklisted'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to blacklist supplier',
        }
      }
    },
    [blacklistMutation, shopId, handleError, showWarning]
  )

  //  REMOVE FROM BLACKLIST

  const removeBlacklist = useCallback(
    async (id: string, businessName?: string) => {
      try {
        const result = await removeBlacklistMutation({ shopId, id }).unwrap()

        showSuccess(
          businessName
            ? `Supplier "${businessName}" removed from blacklist`
            : 'Supplier removed from blacklist',
          'Blacklist Removed'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to remove from blacklist',
        }
      }
    },
    [removeBlacklistMutation, shopId, handleError, showSuccess]
  )

  //  MARK AS PREFERRED

  const markAsPreferred = useCallback(
    async (id: string, businessName?: string) => {
      try {
        const result = await markPreferredMutation({ shopId, id }).unwrap()

        showSuccess(
          businessName
            ? `Supplier "${businessName}" marked as preferred`
            : 'Supplier marked as preferred',
          'Preferred Supplier'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to mark as preferred',
        }
      }
    },
    [markPreferredMutation, shopId, handleError, showSuccess]
  )

  //  REMOVE FROM PREFERRED

  const removePreferred = useCallback(
    async (id: string, businessName?: string) => {
      try {
        const result = await removePreferredMutation({ shopId, id }).unwrap()

        showSuccess(
          businessName
            ? `Supplier "${businessName}" removed from preferred list`
            : 'Supplier removed from preferred list',
          'Preference Removed'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to remove from preferred',
        }
      }
    },
    [removePreferredMutation, shopId, handleError, showSuccess]
  )

  //  UPDATE BALANCE

  const updateBalance = useCallback(
    async (
      id: string,
      balanceData: Omit<UpdateBalanceDto, 'shopId'>,
      businessName?: string
    ) => {
      try {
        const result = await updateBalanceMutation({
          shopId,
          id,
          ...balanceData,
        }).unwrap()

        const actionText =
          balanceData.type === 'payment'
            ? 'Payment recorded'
            : balanceData.type === 'purchase'
              ? 'Purchase recorded'
              : 'Balance adjusted'

        showSuccess(
          businessName
            ? `${actionText} for "${businessName}"`
            : `${actionText} successfully`,
          'Balance Updated'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to update balance',
        }
      }
    },
    [updateBalanceMutation, shopId, handleError, showSuccess]
  )

  // RETURN API

  return {
    // Actions
    createSupplier,
    updateSupplier,
    deleteSupplier,
    restoreSupplier,
    updateRating,
    blacklistSupplier,
    removeBlacklist,
    markAsPreferred,
    removePreferred,
    updateBalance,

    // Loading states
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isRestoring: restoreState.isLoading,
    isUpdatingRating: updateRatingState.isLoading,
    isBlacklisting: blacklistState.isLoading,
    isRemovingBlacklist: removeBlacklistState.isLoading,
    isMarkingPreferred: markPreferredState.isLoading,
    isRemovingPreferred: removePreferredState.isLoading,
    isUpdatingBalance: updateBalanceState.isLoading,

    // States (for advanced usage)
    createState,
    updateState,
    deleteState,
    restoreState,
    updateRatingState,
    blacklistState,
    removeBlacklistState,
    markPreferredState,
    removePreferredState,
    updateBalanceState,
  }
}
