// FILE: src/features/customer/hooks/useCustomerActions.ts
// Hook for customer mutations (create, update, delete, blacklist, loyalty)

import { useCallback } from 'react'
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlacklistCustomerMutation,
  useRemoveBlacklistMutation,
  useAddLoyaltyPointsMutation,
  useRedeemLoyaltyPointsMutation,
} from '@/store/api/customerApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from '@/types/customer.types'

/**
 * Hook for customer mutation operations
 * Handles create, update, delete, blacklist, and loyalty operations
 */
export const useCustomerActions = (shopId: string) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // Mutations
  const [createMutation, createState] = useCreateCustomerMutation()
  const [updateMutation, updateState] = useUpdateCustomerMutation()
  const [deleteMutation, deleteState] = useDeleteCustomerMutation()
  const [blacklistMutation, blacklistState] = useBlacklistCustomerMutation()
  const [removeBlacklistMutation, removeBlacklistState] =
    useRemoveBlacklistMutation()
  const [addLoyaltyMutation, addLoyaltyState] = useAddLoyaltyPointsMutation()
  const [redeemLoyaltyMutation, redeemLoyaltyState] =
    useRedeemLoyaltyPointsMutation()

  // CREATE CUSTOMER

  const createCustomer = useCallback(
    async (
      data: Omit<CreateCustomerInput, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()

        // showSuccess('customer.success.created', 'customer.success.createdTitle')

        return { success: true, data: result }
      } catch (error: any) {
        // handleError(error, setErrors)
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors: Record<string, string> = {}

          error.data.errors.forEach((err: any) => {
            // Extract field name from error detail
            // "referredBy: Cast to ObjectId failed..." → "referredBy"
            const fieldMatch = err.detail?.match(/(\w+):/)
            if (fieldMatch) {
              validationErrors[fieldMatch[1]] = err.detail || err.message
            }
          })

          if (Object.keys(validationErrors).length > 0 && setErrors) {
            setErrors(validationErrors)
          }
        }
        return {
          success: false,
          error: error.data?.message || 'Failed to create customer',
        }
      }
    },
    [createMutation, shopId]
  )

  // UPDATE CUSTOMER

  const updateCustomer = useCallback(
    async (
      customerId: string,
      data: Omit<UpdateCustomerInput, 'shopId' | 'customerId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await updateMutation({
          shopId,
          customerId,
          ...data,
        }).unwrap()

        // showSuccess('customer.success.updated', 'customer.success.updatedTitle')

        return { success: true, data: result }
      } catch (error: any) {
        // handleError(error, setErrors)
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const validationErrors: Record<string, string> = {}

          error.data.errors.forEach((err: any) => {
            const fieldMatch = err.detail?.match(/(\w+):/)
            if (fieldMatch) {
              validationErrors[fieldMatch[1]] = err.detail || err.message
            }
          })

          if (Object.keys(validationErrors).length > 0 && setErrors) {
            setErrors(validationErrors)
          }
        }
        return {
          success: false,
          error: error.data?.message || 'Failed to update customer',
        }
      }
    },
    [updateMutation, shopId]
  )

  // DELETE CUSTOMER

  const deleteCustomer = useCallback(
    async (customerId: string) => {
      try {
        await deleteMutation({ shopId, customerId }).unwrap()

        showSuccess('customer.success.deleted', 'customer.success.deletedTitle')

        return { success: true }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to delete customer',
        }
      }
    },
    [deleteMutation, shopId, handleError, showSuccess]
  )

  // BLACKLIST CUSTOMER

  const blacklistCustomer = useCallback(
    async (customerId: string, reason: string) => {
      try {
        const result = await blacklistMutation({
          shopId,
          customerId,
          reason,
        }).unwrap()

        showSuccess(
          'customer.success.blacklisted',
          'customer.success.blacklistedTitle'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to blacklist customer',
        }
      }
    },
    [blacklistMutation, shopId, handleError, showSuccess]
  )

  // REMOVE BLACKLIST

  const removeBlacklist = useCallback(
    async (customerId: string) => {
      try {
        const result = await removeBlacklistMutation({
          shopId,
          customerId,
        }).unwrap()

        showSuccess(
          'customer.success.blacklistRemoved',
          'customer.success.blacklistRemovedTitle'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to remove blacklist',
        }
      }
    },
    [removeBlacklistMutation, shopId, handleError, showSuccess]
  )

  // ADD LOYALTY POINTS

  const addLoyaltyPoints = useCallback(
    async (customerId: string, points: number, reason?: string) => {
      try {
        const result = await addLoyaltyMutation({
          shopId,
          customerId,
          points,
          reason,
        }).unwrap()

        showSuccess(
          'customer.success.loyaltyAdded',
          'customer.success.loyaltyAddedTitle'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to add loyalty points',
        }
      }
    },
    [addLoyaltyMutation, shopId, handleError, showSuccess]
  )

  // REDEEM LOYALTY POINTS

  const redeemLoyaltyPoints = useCallback(
    async (customerId: string, points: number) => {
      try {
        const result = await redeemLoyaltyMutation({
          shopId,
          customerId,
          points,
        }).unwrap()

        showSuccess(
          'customer.success.loyaltyRedeemed',
          'customer.success.loyaltyRedeemedTitle'
        )

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error)
        return {
          success: false,
          error: error.data?.message || 'Failed to redeem loyalty points',
        }
      }
    },
    [redeemLoyaltyMutation, shopId, handleError, showSuccess]
  )

  // RETURN API

  return {
    // CRUD Actions
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // Blacklist Actions
    blacklistCustomer,
    removeBlacklist,

    // Loyalty Actions
    addLoyaltyPoints,
    redeemLoyaltyPoints,

    // Loading States
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isBlacklisting: blacklistState.isLoading,
    isRemovingBlacklist: removeBlacklistState.isLoading,
    isAddingLoyalty: addLoyaltyState.isLoading,
    isRedeemingLoyalty: redeemLoyaltyState.isLoading,

    // Mutation States (for advanced usage)
    createState,
    updateState,
    deleteState,
    blacklistState,
    removeBlacklistState,
    addLoyaltyState,
    redeemLoyaltyState,
  }
}
