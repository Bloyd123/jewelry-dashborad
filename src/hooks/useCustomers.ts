// FILE: src/features/customer/hooks/useCustomer.ts
// Customer Business Logic Hook with Error Handling

import { useCallback } from 'react'
import {
  useGetCustomersQuery,
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
  CustomerListParams,
} from '@/types/customer.types'

/**
 * Custom hook for customer operations
 * Handles all customer-related business logic with error handling
 */
export const useCustomer = (
  shopId: string,
  filters?: Partial<CustomerListParams>
) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ============================================
  // 📊 FETCH DATA (with auto-caching)
  // ============================================
  const { data, isLoading, isFetching, error, refetch } = useGetCustomersQuery({
    shopId,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    ...filters,
  })

  // ============================================
  // 🔧 MUTATIONS
  // ============================================
  const [createMutation, createState] = useCreateCustomerMutation()
  const [updateMutation, updateState] = useUpdateCustomerMutation()
  const [deleteMutation, deleteState] = useDeleteCustomerMutation()
  const [blacklistMutation, blacklistState] = useBlacklistCustomerMutation()
  const [removeBlacklistMutation, removeBlacklistState] =
    useRemoveBlacklistMutation()
  const [addLoyaltyMutation, addLoyaltyState] = useAddLoyaltyPointsMutation()
  const [redeemLoyaltyMutation, redeemLoyaltyState] =
    useRedeemLoyaltyPointsMutation()

  // ============================================
  // ➕ CREATE CUSTOMER with error handling
  // ============================================
  const createCustomer = useCallback(
    async (
      data: Omit<CreateCustomerInput, 'shopId'>,
      setErrors?: (errors: Record<string, string>) => void
    ) => {
      try {
        const result = await createMutation({ shopId, ...data }).unwrap()

        // ✅ Success notification (i18n)
        showSuccess('customer.success.created', 'customer.success.createdTitle')

        return { success: true, data: result }
      } catch (error: any) {
        // ❌ Handle error (shows toast + sets form errors)
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to create customer',
        }
      }
    },
    [createMutation, shopId, handleError, showSuccess]
  )

  // ============================================
  // ✏️ UPDATE CUSTOMER with error handling
  // ============================================
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

        showSuccess('customer.success.updated', 'customer.success.updatedTitle')

        return { success: true, data: result }
      } catch (error: any) {
        handleError(error, setErrors)
        return {
          success: false,
          error: error.data?.message || 'Failed to update customer',
        }
      }
    },
    [updateMutation, shopId, handleError, showSuccess]
  )

  // ============================================
  // 🗑 DELETE CUSTOMER with confirmation
  // ============================================
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

  // ============================================
  // 🚫 BLACKLIST CUSTOMER
  // ============================================
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

  // ============================================
  // ✅ REMOVE BLACKLIST
  // ============================================
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

  // ============================================
  // ➕ ADD LOYALTY POINTS
  // ============================================
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

  // ============================================
  // 🎁 REDEEM LOYALTY POINTS
  // ============================================
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

  // ============================================
  // 📤 RETURN API
  // ============================================
  return {
    // Data
    customers: data?.data?.customers || [],
    summary: data?.data?.summary,
    pagination: data?.meta?.pagination,

    // Loading states
    isLoading: isLoading || isFetching,
    isCreating: createState.isLoading,
    isUpdating: updateState.isLoading,
    isDeleting: deleteState.isLoading,
    isBlacklisting: blacklistState.isLoading,
    isRemovingBlacklist: removeBlacklistState.isLoading,
    isAddingLoyalty: addLoyaltyState.isLoading,
    isRedeemingLoyalty: redeemLoyaltyState.isLoading,

    // Actions
    createCustomer,
    updateCustomer,
    deleteCustomer,
    blacklistCustomer,
    removeBlacklist,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    refetch,

    // States
    createState,
    updateState,
    deleteState,
    blacklistState,
    removeBlacklistState,
    addLoyaltyState,
    redeemLoyaltyState,
    error,
  }
}
